import request from '../utils/request'

const PROPERTY_API = {
  publicList: '/house/search',
  myList: '/house/list',
  myDetail: '/house/detail',
}

export interface RawHouseItem {
  house_id?: string
  _id?: string
  owner_id?: string
  area: string
  location: string
  type: string
  price: number
  tags?: string[]
  status: number
  images?: string[]
  created_at: number
  updated_at: number
}

interface HouseListPayload {
  list?: RawHouseItem[]
  items?: RawHouseItem[]
  houses?: RawHouseItem[]
}

export interface HouseListParams {
  area?: string
  min_price?: number
  max_price?: number
  type?: string
  tags?: string[]
  keyword?: string
  page?: number
  limit?: number
  status?: number
}

export interface PropertyListItem {
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

function buildPropertySummary(tags: string[], location: string): string {
  if (tags.length > 0) {
    return `亮点：${tags.slice(0, 2).join(' / ')}`
  }

  return `${location} 暂无标签，可继续补充房源信息`
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

function adaptHouseToCard(house: RawHouseItem): PropertyListItem {
  const tags = house.tags || []
  const district = house.area ? `${house.area} · ${house.location}` : house.location
  const statusText = getHouseStatusText(house.status)
  const details = `${house.type} · ${statusText}`
  const id = house.house_id || house._id || ''

  return {
    id,
    title: `${house.location} ${house.type}`,
    district,
    details,
    priceText: `¥${house.price}/月`,
    tags,
    cover: house.images && house.images.length > 0 ? house.images[0] : '',
    summary: buildPropertySummary(tags, house.location),
    statusText,
  }
}

function getHouseId(house: RawHouseItem): string {
  return house.house_id || house._id || ''
}

function buildPublicSearchPayload(params?: HouseListParams): WechatMiniprogram.IAnyObject {
  return {
    area: params?.area || '',
    min_price: typeof params?.min_price === 'number' ? params.min_price : 0,
    max_price: typeof params?.max_price === 'number' ? params.max_price : 0,
    type: params?.type || '',
    tags: params?.tags || [],
    keyword: params?.keyword || '',
    page: typeof params?.page === 'number' ? params.page : 1,
    limit: typeof params?.limit === 'number' ? params.limit : 10,
  }
}

export function fetchPublicPropertyList(
  params?: HouseListParams
): Promise<PropertyListItem[]> {
  return request<HouseListPayload | RawHouseItem[]>({
    url: PROPERTY_API.publicList,
    data: buildPublicSearchPayload(params),
  }).then((data) => {
    return normalizeHouseList(data).map(adaptHouseToCard)
  })
}

export function fetchMyPropertyList(
  params?: HouseListParams
): Promise<PropertyListItem[]> {
  return request<HouseListPayload | RawHouseItem[]>({
    url: PROPERTY_API.myList,
    data: {
      ...(params || {}),
    },
  }).then((data) => {
    return normalizeHouseList(data).map(adaptHouseToCard)
  })
}

export function fetchPublicPropertyDetail(id: string): Promise<RawHouseItem> {
  // 临时兜底：当前公开 detail 未就绪，先通过公开 search 拉取列表后按 id 命中。
  return request<HouseListPayload | RawHouseItem[]>({
    url: PROPERTY_API.publicList,
    data: buildPublicSearchPayload({
      page: 1,
      limit: 20,
    }),
  }).then((data) => {
    const house = normalizeHouseList(data).find((item) => getHouseId(item) === id)

    if (!house) {
      throw new Error('未找到对应房源详情')
    }

    return house
  })
}

export function fetchMyPropertyDetail(id: string): Promise<RawHouseItem> {
  return request<RawHouseItem>({
    url: PROPERTY_API.myDetail,
    data: { house_id: id },
  })
}
