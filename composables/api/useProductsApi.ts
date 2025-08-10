import { useApi } from './useApi'

export const useProductsApi = () => {
  const { api } = useApi()

  const getProducts = async (params: any = {}) => {
    try {
      const orderBy: string[] = []

      // Varsayılan sıralama: created_at ASC
      orderBy.push(`{"k":"created_at","v":"ASC"}`)

      const defaultParams = {
        filter: [JSON.stringify({ k: 'is_deleted', o: '=', v: false }), JSON.stringify({ k: 'status', o: '=', v: true })],
        with: ['city', 'district', 'doping'],
        page: 1,
        ...params
      }

      const response = await api.get('products', defaultParams)
      return response
    } catch (error) {
      console.error('getProducts error:', error)
      throw error
    }
  }

  const getProductById = async (id: string) => {
    try {
      const response = await api.get(`products/${id}`, {
        filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
        with: ["images", "owner", "city", "district", "categories"],

      })

      return response
    } catch (error) {
      console.error('getProductById error:', error)
      throw error
    }

  }



  const getProductsFilterQuery = (page: number, payload: any) => {
    const citynum = ref<number[]>([]);
    const districtnum = ref<number[]>([]);
    payload.selectedCities.forEach((element: any) => {
      citynum.value.push(element)
    })
    payload.selectedDistricts.forEach((element: any) => {
      districtnum.value.push(element)
    })

    const filter: string[] = [
      `{"k": "category_code", "o": "=", "v": "${payload.categoryCode}"}`,
    ];

    const orderBy: string[] = []

    if (payload.swap === true || payload.swap === false) {
      filter.push(`{"k":"swap","o":"=","v":${payload.swap}}`);
    }

    if (citynum.value.length >= 1) {
      filter.push(`{"k": "city", "o": "in", "v": ${JSON.stringify(citynum.value)}}`);
    }
    if (districtnum.value.length >= 1) {
      filter.push(`{"k": "district", "o": "in", "v": ${JSON.stringify(districtnum.value)}}`);
    }

    if (payload.priceRange.min >= 0 && payload.priceRange.max > 0) {
      filter.push(`{"k": "price", "o": ">=", "v": ${payload.priceRange.min}}`);
      filter.push(`{"k": "price", "o": "<=", "v": ${payload.priceRange.max}}`);
    }

    if (payload.dateSort !== "") {
      orderBy.push(`{"k":"created_at","o":"=","v":"${payload.dateSort}"}`);
    }

    if (payload.priceSort !== "") {
      orderBy.push(`{"k":"price","o":"=","v":"${payload.priceSort}"}`);
    }
    //sadece aktif olan ilanalr gelsin
    filter.push(`{"k": "status", "o": "=", "v": true}`);

    return api.get('products', {
      filter: filter,
      with: ['images', 'owner','city', 'district'],
      orderBy: orderBy,
      page: page
    });

  }

  // herhangi bir kullancıın ürünleirn al
  const getSellerProfileAndProducts = (code: string,page=1) => {

    //filter.push(`{"k": "status", "o": "=", "v": true}`); //onaylanmış urunler
    //filter.push(`{"k": "swap", "o": "=", "v": true}`); //onaylanmış urunler

    return api.get(`owner-products/${code}?page=${page}`, {
      params: {
        with: ["images", "owner","doping","city"],

      }
    })
  }

  // Kullanıcının kendi ürünlerini getir
  const myProducts2 = async (params: any = {}) => {
    try {
      const filter: string[] = []
      
      // Temel filtreler
      if (params.filter?.search) {
        filter.push(`{"k":"title","o":"LIKE","v":"%${params.filter.search}%"}`)
      }
      
      if (params.filter?.min_price !== null && params.filter?.min_price !== undefined) {
        filter.push(`{"k":"price","o":">=","v":${params.filter.min_price}}`)
      }
      
      if (params.filter?.max_price !== null && params.filter?.max_price !== undefined) {
        filter.push(`{"k":"price","o":"<=","v":${params.filter.max_price}}`)
      }
      
      if (params.filter?.swap !== 'all') {
        filter.push(`{"k":"swap","o":"=","v":${params.filter.swap === 'true'}`)
      }
      
      if (params.filter?.status !== 'all') {
        filter.push(`{"k":"status","o":"=","v":"${params.filter.status}"}`)
      }
      
      // Sıralama
      const orderBy: string[] = []
      if (params.filter?.orderBy) {
        switch (params.filter.orderBy) {
          case 'DATE_DESC':
            orderBy.push(`{"k":"created_at","v":"DESC"}`)
            break
          case 'DATE_ASC':
            orderBy.push(`{"k":"created_at","v":"ASC"}`)
            break
          case 'PRICE_DESC':
            orderBy.push(`{"k":"price","v":"DESC"}`)
            break
          case 'PRICE_ASC':
            orderBy.push(`{"k":"price","v":"ASC"}`)
            break
        }
      } else {
        // Varsayılan sıralama
        orderBy.push(`{"k":"created_at","v":"DESC"}`)
      }

      const response = await api.get('auth/list-v2', {
        params: {
          filter: filter.length > 0 ? filter : undefined,
          orderBy: orderBy.length > 0 ? orderBy : undefined,
          page: params.filter?.page || 1,
          with: ['images', 'doping']
        }
      })
      
      return response
    } catch (error) {
      console.error('myProducts2 error:', error)
      throw error
    }
  }


  return {
    getProducts,
    getProductById,
    getProductsFilterQuery,
    getSellerProfileAndProducts,
    myProducts2
  }
}
