<template>
	<neil-modal :show="isShow" @close="onClose" title="提示" confirm-text="关闭" :show-cancel="false">
		<view class="text-center">
			<text>请先登录本系统</text>
		</view>
		<view class="login">
			<button type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo">登录</button>
		</view>
	</neil-modal>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		name: 'user-login',
		components: {
			neilModal
		},
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				isShow: false
			}
		},
		created() {
			this.isShow = this.show
		},
		watch: {
			show(val) {
				this.isShow = val
			}

		},
		methods: {
			getuserinfo: async function(e) {
				if (e.detail.errMsg !== "getUserInfo:ok") return;
				let userinfo = this.$store.state.userinfo
				let detail = e.detail.userInfo
				let user = { ...userinfo,
					...{
						nickName: detail.nickName,
						faceUrl: detail.avatarUrl,
						city: detail.city,
						country: detail.country,
						gender: detail.gender,
						language: detail.language,
						province: detail.province
					}
				}
				var {
					data
				} = await http.post('/user', user)
				data.result.isRegisted = true
				this.$store.commit('setUserInfo', data.result)
				uni.showToast({
					title: '登录成功'
				})

				this.onClose();
			},
			onClose: function() {
				this.isShow = false
				this.$emit('close')
			}
		}
	}
</script>

<style>
	.text-center {
		padding: 20upx;
		text-align: center;
	}

	.login {
		padding: 20upx 50upx;
	}
</style>
