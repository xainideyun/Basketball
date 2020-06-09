import Vue from 'vue'
import Vuex from 'vuex'
import { http } from '../utils/luch-request/index'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userinfo: {},			// 登录的用户信息
		showAddTip: false	// 是否显示添加到我的小程序
	},
	mutations: {
		login: function(state, userinfo) {
			state.userinfo = userinfo
			var loginTimes = +uni.getStorageSync('loginTimes')
			if (loginTimes < 5) {
				state.showAddTip = true
			}
		},
		setUserInfo: function(state, userinfo) {
			state.userinfo = userinfo
			uni.setStorageSync('userinfo', userinfo)
		}
	},
	actions: {
		login: function({ commit }){
			var userinfo = uni.getStorageSync("userinfo")
			var loginTimes = uni.getStorageSync('loginTimes') || 0	// 登录次数
			loginTimes = +loginTimes + 1
			uni.setStorageSync('loginTimes', loginTimes)
			
			if(!userinfo) {
				uni.login({
					provider: 'weixin',
					success: async function(loginRes) {
						var { data } = await http.get('/user?code=' + loginRes.code)
						data.result.isRegisted = !data.result.nickName ? false : true
						if (!data.result.faceUrl) {
							data.result.faceUrl = '/static/face.png'
						}
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
