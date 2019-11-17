<template>
	<view class="page">
		<view style="text-align: center;">
			<text style="font-size: 1.2em;">球队：<text style="color: red;">{{name}}</text></text>
		</view>
		<view class="qrcode">
			<image :src="qrcodeUrl" mode="aspectFill"></image>
		</view>
		<view class="self">
			<button type="primary" size="mini" open-type="share">分享</button>
			<text class="join" @tap="onJoin()">我要加入</text>
		</view>
		<text class="jdcat jdcat-duoren" style="margin-left: 50upx; color: #555">已加入成员：</text>
		<scroll-view :scroll-y="true" class="scroll">
			<view class="players">
				<view class="player" v-for="(player, index) in players" :key="index">
					<view class="face">
						<image :src="player.faceUrl" mode="aspectFit" style="border-radius: 50%;">
					</view>
					<view class="player-info">
						<text class="player-name">{{player.name}}</text>
						<text class="player-number">{{player.playNumber}}号</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<user-login :show="show" @close="onClose"></user-login>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	import userLogin from "@/components/basketball/user-login.vue"
	var timeId
	export default {
		components: {
			userLogin
		},
		data() {
			return {
				teamId: 0,
				name: '',
				qrcodeUrl: null,
				players: [],
				show: false
			}
		},
		onLoad: async function(e) {
			this.teamId = e.id || 1
			this.name = e.name
			var {
				data
			} = await http.post(`/util/qrcode`, {
				item1: `?id=${e.id}`,
				item2: 'pages/home/match/join'
			})
			this.qrcodeUrl = data.result
			this._loadPlayers()
		},
		onUnload() {
			this._close()
		},
		methods: {
			onJoin() {
				var self = this;
				let user = this.$store.state.userinfo
				if (!user.isRegisted) {
					this.show = true
					return
				}
				var player = this.players.find(obj => obj.userInfoId === this.$store.state.userinfo.id)
				if (player) {
					uni.showToast({
						title: '已经加入', icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/home/match/join?id=' + this.teamId
				})
			},
			onClose: function() {
				this.show = false
			},
			_loadPlayers: async function() {
				var self = this
				var {
					data
				} = await http.get("/match/team/players/" + this.teamId)
				data.forEach(a => self.players.push(a))
				timeId = setInterval(async () => {
					var {
						data
					} = await http.get("/match/team/newplayers/" + self.teamId)
					var news = []
					data.forEach(a => {
						var p = self.players.find(obj => obj.id === a.id)
						if (p) return
						news.push(a)
						self.players.push(a)
						uni.showToast({
							title: a.name + '加入', icon: 'none'
						})
					})
					if (news.length === 0)return
					uni.$emit("updatePlayer", JSON.parse(JSON.stringify(self.players)))
				}, 3000)
			},
			_close() {
				clearInterval(timeId)
			}
		}
	}
</script>

<style lang="scss">
	.page {
		position: fixed;
		display: flex;
		flex-flow: column;
		align-items: stretch;
		background-color: #fff;
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

	.self {
		display: flex;
		text-align: center;
		flex-flow: column;
		border-bottom: 1upx solid #ddd; 
		padding-bottom: 20upx;
		
		.join {
			margin-top: 10upx;
			color: #007AFF;
		}
	}

	.scroll {
		flex-grow: 1;
		height: 100upx;
	}


	.players {
		font-size: 80%;
		padding: 20upx 50upx;

		.player {
			display: flex;
			flex-flow: row;
			justify-content: center;
			align-items: center;
			border-bottom: 1px solid #ddd;
			padding: 10upx 0;

			.face {
				border-radius: 50%;
				border: 1px solid #fff;
				width: 80upx;
				height: 80upx;
				margin-right: 20upx;

				image {
					width: 70upx;
					height: 70upx;
				}
			}

			.player-info {
				display: flex;
				flex-flow: row;
				flex-grow: 1;
				justify-content: space-between;
				
				.player-name {
					width: 300upx;
				}
				
				view {
					padding: 2upx 0;
				}

			}

		}

		.player:last-child {
			border-bottom: none;
		}
	}
</style>
