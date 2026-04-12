import { API_ENDPOINTS } from '../api/endpoints'
import request from '../utils/request'

export interface RawHouseItem {
  house_id?: string
  _id?: string
  owner_id?: string
  area: string
  location: string
  price: number
  status: number
  images?: string[]
  rent_mode?: 'whole' | 'shared'
  room_count?: number
  hall_count?: number
  bathroom_count?: number
  payment_cycle?: string
  near_subway?: boolean
  walk_to_subway_min?: number
  pet_friendly?: boolean
  has_elevator?: boolean
  cooking_allowed?: boolean
  furnished_level?: 'none' | 'basic' | 'full'
  tags?: string[]
  created_at: number
  updated_at: number
}

interface HouseListPayload {
  total?: number
  page?: number
  limit?: number
  list?: RawHouseItem[]
  items?: RawHouseItem[]
  houses?: RawHouseItem[]
}

export interface HouseListParams {
  area?: string
  min_price?: number
  max_price?: number
  keyword?: string
  rent_mode?: 'whole' | 'shared' | ''
  room_count_min?: number
  room_count_max?: number
  payment_cycle?: string
  near_subway?: boolean
  pet_friendly?: boolean
  has_elevator?: boolean
  cooking_allowed?: boolean
  furnished_level?: 'none' | 'basic' | 'full' | ''
  page?: number
  limit?: number
  sort_by?: string
}

export interface HouseListItem {
  id: string
  title: string
  district: string
  details: string
  priceText: string
  tags: string[]
  cover: string
  summary: string
  statusText: string
}

const HOUSE_CACHE: { [key: string]: RawHouseItem } = {}

function isHttpUrl(value: string): boolean {
  return value.indexOf('https://') === 0 || value.indexOf('http://') === 0
}

function isBlockedImageHost(value: string): boolean {
  // 一些测试图床在小程序环境下经常 502，这里直接过滤，避免渲染层重复报错。
  return value.indexOf('dummyimage.com') >= 0
}

function normalizeImageUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  const url = value.trim()

  if (!url || !isHttpUrl(url) || isBlockedImageHost(url)) {
    return ''
  }

  return url
}

function normalizeImageList(images: unknown): string[] {
  if (!Array.isArray(images)) {
    return []
  }

  return images
    .map((item) => normalizeImageUrl(item))
    .filter((item) => !!item)
}

function normalizeHouseList(data: HouseListPayload | RawHouseItem[]): RawHouseItem[] {
  if (Array.isArray(data)) {
    return data
  }

  if (data.list && Array.isArray(data.list)) {
    return data.list
  }

  if (data.items && Array.isArray(data.items)) {
    return data.items
  }

  if (data.houses && Array.isArray(data.houses)) {
    return data.houses
  }

  return []
}

function buildHouseSummary(tags: string[], location: string): string {
  if (tags.length > 0) {
    return `亮点：${tags.slice(0, 2).join(' / ')}`
  }

  return `${location} 信息完善中`
}

function getHouseStatusText(status: number): string {
  if (status === 1) {
    return '待租'
  }
  if (status === 2) {
    return '已租'
  }

  return '下架'
}

function getRentModeText(mode: RawHouseItem['rent_mode']): string {
  if (mode === 'whole') {
    return '整租'
  }
  if (mode === 'shared') {
    return '合租'
  }
  return '租住方式待补充'
}

function getHouseLayoutText(house: RawHouseItem): string {
  if (typeof house.room_count === 'number') {
    const hall =
      typeof house.hall_count === 'number' && house.hall_count >= 0
        ? `${house.hall_count}厅`
        : ''
    return `${house.room_count}室${hall}`
  }

  return '户型待补充'
}

function buildFeatureTags(house: RawHouseItem): string[] {
  const rawTags = Array.isArray(house.tags) ? house.tags : []
  const tags = rawTags.slice(0, 4)

  if (house.near_subway && tags.indexOf('近地铁') < 0) {
    tags.unshift('近地铁')
  }
  if (house.pet_friendly && tags.indexOf('可养宠物') < 0) {
    tags.push('可养宠物')
  }
  if (house.payment_cycle && tags.indexOf(house.payment_cycle) < 0) {
    tags.push(house.payment_cycle)
  }

  return tags.slice(0, 4)
}

function adaptHouseToCard(house: RawHouseItem): HouseListItem {
  const tags = buildFeatureTags(house)
  const district = house.area ? `${house.area} · ${house.location}` : house.location
  const statusText = getHouseStatusText(house.status)
  const details = `${getRentModeText(house.rent_mode)} · ${getHouseLayoutText(house)} · ${statusText}`
  const id = house.house_id || house._id || ''
  const safeImages = normalizeImageList(house.images)

  return {
    id,
    title: house.location || '房源信息',
    district,
    details,
    priceText: `¥${house.price}/月`,
    tags,
    cover: safeImages.length > 0 ? safeImages[0] : '',
    summary: buildHouseSummary(tags, house.location),
    statusText,
  }
}

function getHouseId(house: RawHouseItem): string {
  return house.house_id || house._id || ''
}

function normalizeHouseEntity(house: RawHouseItem): RawHouseItem {
  return {
    ...house,
    images: normalizeImageList(house.images),
  }
}

function buildPublicSearchPayload(params?: HouseListParams): WechatMiniprogram.IAnyObject {
  const payload: WechatMiniprogram.IAnyObject = {
    area: params?.area || '',
    min_price: typeof params?.min_price === 'number' ? params.min_price : 0,
    max_price: typeof params?.max_price === 'number' ? params.max_price : 0,
    keyword: params?.keyword || '',
    page: typeof params?.page === 'number' ? params.page : 1,
    limit: typeof params?.limit === 'number' ? params.limit : 10,
  }

  if (params?.rent_mode) {
    payload.rent_mode = params.rent_mode
  }
  if (typeof params?.room_count_min === 'number' && params.room_count_min > 0) {
    payload.room_count_min = params.room_count_min
  }
  if (typeof params?.room_count_max === 'number' && params.room_count_max > 0) {
    payload.room_count_max = params.room_count_max
  }
  if (params?.payment_cycle) {
    payload.payment_cycle = params.payment_cycle
  }
  if (typeof params?.near_subway === 'boolean') {
    payload.near_subway = params.near_subway
  }
  if (typeof params?.pet_friendly === 'boolean') {
    payload.pet_friendly = params.pet_friendly
  }
  if (typeof params?.has_elevator === 'boolean') {
    payload.has_elevator = params.has_elevator
  }
  if (typeof params?.cooking_allowed === 'boolean') {
    payload.cooking_allowed = params.cooking_allowed
  }
  if (params?.furnished_level) {
    payload.furnished_level = params.furnished_level
  }
  if (params?.sort_by) {
    payload.sort_by = params.sort_by
  }

  return payload
}

export function fetchPublicHouseList(
  params?: HouseListParams
): Promise<HouseListItem[]> {
  return request<HouseListPayload | RawHouseItem[]>({
    url: API_ENDPOINTS.house.search,
    data: buildPublicSearchPayload(params),
  }).then((data) => {
    return normalizeHouseList(data).map((house) => {
      const normalized = normalizeHouseEntity(house)
      const id = getHouseId(normalized)

      if (id) {
        HOUSE_CACHE[id] = normalized
      }

      return adaptHouseToCard(normalized)
    })
  })
}

export function fetchPublicHouseDetail(id: string): Promise<RawHouseItem> {
  const cached = HOUSE_CACHE[id]

  if (cached) {
    return Promise.resolve(cached)
  }

  // 临时兜底：公开 detail 未就绪时，分页扫描公开 search 结果命中 house_id。
  const pageSize = 50
  const maxPages = 10

  const findInPage = (page: number): Promise<RawHouseItem> => {
    return request<HouseListPayload | RawHouseItem[]>({
      url: API_ENDPOINTS.house.search,
      data: buildPublicSearchPayload({
        page,
        limit: pageSize,
      }),
    }).then((data) => {
      const payload = Array.isArray(data) ? undefined : data
      const list = normalizeHouseList(data).map(normalizeHouseEntity)
      const matched = list.find((item) => getHouseId(item) === id)

      if (matched) {
        const matchedId = getHouseId(matched)
        if (matchedId) {
          HOUSE_CACHE[matchedId] = matched
        }
        return matched
      }

      if (page >= maxPages) {
        throw new Error('未找到对应房源详情')
      }

      if (payload && typeof payload.total === 'number' && payload.total >= 0) {
        const totalPages = Math.ceil(payload.total / pageSize)

        if (page >= totalPages) {
          throw new Error('未找到对应房源详情')
        }
      }

      if (list.length === 0) {
        throw new Error('未找到对应房源详情')
      }

      return findInPage(page + 1)
    })
  }

  return findInPage(1)
}
