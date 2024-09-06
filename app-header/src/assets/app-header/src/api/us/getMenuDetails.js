import axios from 'axios'


export default function getMenuDetails() {
    return axios.get("/insightweb/getAccountToolsMenuDetails");
}
