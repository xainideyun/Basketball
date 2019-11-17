<template>
	<view class="page">
		<button type="primary" size="mini">更换统计员</button>
		<user-login :show="show" @close="onClose" @tap="onSubmit"></user-login>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	import userLogin from "@/components/basketball/user-login.vue"

	export default {
		components: {
			userLogin
		},
		data() {
			return {
				team: null,
				show: false,
				id: null
			}
		},
		onLoad: async function(e) {
			this.id = e.id || 29
			
			var {data} = await http.get(`/match/team/${this.id}`)
			this.team = data
			
			setTimeout(function() {
				this.onSubmit()
			}.bind(this), 1000)
		},
		methods: {
			onClose() {
				this.show = false
			},
			onSubmit: function () {
				if (!this.$store.state.userinfo.isRegisted) {
					this.show = true
					return
				}
				let self = this
				uni.showModal({
					title: '提示',
					content: `您确定要成为球队[${this.team.name}]的统计员吗？`,
					success: async function (e) {
						if (!e.confirm) return
						var {
							data
						} = await http.put(`/match/team/change/${self.id}?userId=${self.$store.state.userinfo.id}`)
						uni.showToast({
							title: '更换成功'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/home/match/single?id=' + self.team.matchId
							})
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style>
	.page {
		display: flex;
		flex-flow: column;
		padding-top: 100upx;
		background-color: #fff;
		align-items: center;
		justify-content: center;

	}
</style>
