<template>
	<view class="page">
		<view>
			<text style="font-size: 1.2em;">球队：<text style="color: red;">{{name}}</text></text>
		</view>
		<view class="qrcode">
			<image :src="qrcodeUrl" mode="aspectFill"></image>
		</view>
		<view>
			<text style="color: gray;">请扫码更换统计员</text>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	var timeId
	export default {
		data() {
			return {
				teamId: 0,
				name: '',
				qrcodeUrl: null
			}
		},
		onLoad: async function(e) {
			this.teamId = e.id || 1
			this.name = e.name
			var {
				data
			} = await http.post(`/util/qrcode`, {
				item1: `?id=${e.id}`,
				item2: 'pages/home/match/confirmChange'
			})
			this.qrcodeUrl = data.result
			this._open()
		},
		onUnload() {
			this._close()
		},
		methods: {
			_open() {
				timeId = setInterval(async function() {
					var {data} = await http.get("/match/team/" + this.teamId)
					if (this.$store.state.userinfo.id === data.userInfoId) return
					this._close()
					uni.showModal({
						title: '提示',
						content: '统计员已更换',
						complete() {
							uni.switchTab({
								url: "/pages/tabBar/home"
							})
						}
					})
				}.bind(this), 1000)
			},
			_close() {
				clearInterval(timeId)
			}
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-flow: column;
		padding-top: 100upx;
		background-color: #fff;
		align-items: center;
	}
	
	.qrcode {
		padding: 20upx;
		height: 510upx;
		text-align: center;
		width: 100%;

		image {
			width: 500upx;
		}
	}
</style>
