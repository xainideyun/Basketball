import Vue from 'vue'
import Vuex from 'vuex'
import { http } from '../utils/luch-request/index'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userinfo: {}
	},
	mutations: {
		login: function(state, userinfo) {
			state.userinfo = userinfo
		},
		setUserInfo: function(state, userinfo) {
			state.userinfo = userinfo
			uni.setStorageSync('userinfo', userinfo)
		}
	},
	actions: {
		login: function({ commit }){
			var userinfo = uni.getStorageSync("userinfo");
			if(!userinfo) {
				uni.login({
					provider: 'weixin',
					success: async function(loginRes) {
						var { data } = await http.get('/user?code=' + loginRes.code)
						data.result.isRegisted = !data.result.nickName ? false : true
						commit('login', data.result)
						uni.setStorageSync('userinfo', data.result)
					}
				})
			} else {
				commit('login', userinfo)
			}
		},
		
	}
})

export default store
