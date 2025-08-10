import { useApi } from './useApi'

export const useLocationApi = () => {
    const {api} = useApi()

    const getCities = async () => {
        try {
            const response = await api.get('cities', {
                filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
                limit:100
            })

            return response
        } catch (error) {
            console.error('getCities error:', error)
            throw error
        }
    }

    const getDistricts = async (cityId: number) => {
        try {
            const response = await api.get('districts', {
                filter: [JSON.stringify({k: "city_code", o: "=", v: cityId})],
                limit: 100
            })

            return response

        } catch (error) {
            console.error('getDistricts error:', error)
            throw error
        }

    }


    const getLocalizations = async (districtId: number) => {
        try {
            const response = await api.get('localizations', {
                filter: [JSON.stringify({ k: "district_code", o: "=", v: districtId })],
                limit:300
            })
            return response
        } catch (error) {
            console.error('getLocalizations error:', error)
            throw error
        }
    }


    return {
        getCities,
        getDistricts,
        getLocalizations
    }
}
