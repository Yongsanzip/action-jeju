import axios from 'axios'

const SETTINGS = {
    BASIC_URL: 'http://220.90.200.93',
    //BASIC_URL: 'http://www.actionjeju.com',
    DOMAIN: '/api'
};

export default {
    request(settings) {
        const GET_URL = settings.url;

        if(GET_URL.startsWith('/bbs')) {
            settings.url = SETTINGS.BASIC_URL + GET_URL;
        }
        else if (!GET_URL.startsWith('/ajax')) {
            settings.url = SETTINGS.BASIC_URL + '/societive' + SETTINGS.DOMAIN + GET_URL;
        }else{
            settings.url = SETTINGS.BASIC_URL + '/societive' + GET_URL;
        }

        return axios(settings, settings.header != null? settings.header : null)
            .then(res => res)
            .catch(err => {
                throw err
            })
    }
}