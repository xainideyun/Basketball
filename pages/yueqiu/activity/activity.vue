<template>
	<view class="page">
		<view class="field-item">
			<text class="jdcat jdcat-biaoti"></text>
			<text class="field-content">{{activity.title}}</text>
		</view>
		<view class="field-item">
			<text class="jdcat jdcat-date"></text>
			<text class="field-content">{{activityTime(activity.activityTime)}}</text>
		</view>
		<view class="field-item" @tap="toLocation">
			<text class="jdcat jdcat-address"></text>
			<view class="address field-content">
				<text class="location">{{activity.location}}</text>
				<text class="detail">{{activity.address}}</text>
			</view>
			<text class="jdcat jdcat-right"></text>
		</view>
		<view class="field-item">
			<text class="jdcat jdcat-tip"></text>
			<text class="field-content">{{activity.remark}}</text>
		</view>
		<view class="field-item" style="border-top: 20upx solid #ddd;">
			<text class="jdcat jdcat-person1"></text>
			<view class="field-content">
				共<text class="text-green">{{activity.quantity}}</text>人报名，
				参加<text class="text-green">{{activity.joinQuantity}}</text>人，
				待定<text class="text-red">{{activity.pendingQuantity}}</text>人，
				缺席<text class="text-red">{{activity.absentQuantity}}</text>人
			</view>
		</view>
		<view class="player-container">
			<view class="player" v-for="(item, index) in activity.activityParticipants" :key='index' @tap="toPeople(item)">
				<view class="face">
					<image :src='item.faceUrl' mode="aspectFit" style="border-radius: 50%;">
				</view>
				<view class="player-info">
					<text class="player-name">{{item.name}}</text>
					<text class="play-time">{{item.joinTime}}</text>
				</view>
				<text :class="item.status == 1 ? 'text-green' : 'text-red'" style="width: 80upx;">{{joinStatus(item.status)}}</text>
				<text class="jdcat jdcat-right" style="width: 60upx;"></text>
			</view>
		</view>
		<view class="activity-func">
			<view class="activity-time">
				<text>比赛发布时间：{{activity.createTime}}</text>
			</view>
			<view class="button">
				<button type="default" class="bg-green" @tap="join">报名</button>
				<button type="primary" open-type="share">分享</button>
			</view>
			<view class="button button-qrcode">
				<button type="warn" style="width:50%" @tap="onQrcode">活动二维码</button>
				<text style="color: #ccc; text-align: center;">（扫码报名）</text>
			</view>
		</view>
		<view class="activity-operate" v-if="isCreator">
			<text class="desc">更多选项（仅创建可见）</text>
			<button type="default" @tap="onEdit">编辑</button>
			<button type="warn" v-if="activity.quantity === 0" @tap="onDelete">删除</button>
		</view>


		<neil-modal :show="showQrcode" @close="onCloseQrcode" title="二维码" confirm-text="关闭" :show-cancel="false">
			<view style="min-height: 90upx;padding: 20upx;text-align: center;">
				<view style="padding: 10upx;text-align: center;">
					<image :src="qrcodeUrl" mode="aspectFit" style="width: 100%;"></image>
				</view>
				<text style="color:#aaa; margin:10upx 0;">扫码报名</text>
			</view>
		</neil-modal>
		<user-login :show="show" @close="onClose"></user-login>
<!-- 
		<uni-fab :pattern="fab.pattern" :content="fab.content" icon="jdcat-back" :horizontal="fab.horizontal" :vertical="fab.vertical"
		 :direction="fab.direction" @onClick="back"></uni-fab> -->

		<view style="height: 200upx;"></view>
		<ad unit-id="adunit-2412e37f507a6d4a"></ad>
	</view>
</template>

<script>
	import userLogin from "@/components/basketball/user-login.vue"
	import {
		http
	} from '@/utils/luch-request/index.js'
	import {
		joinStatus
	} from "@/utils/enum.js"
	import {
		dateUtils
	} from "@/utils/util.js"
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	export default {
		components: {
			neilModal,
			userLogin,
			uniFab
		},
		data() {
			return {
				activity: {},
				id: 0,
				showQrcode: false,
				qrcodeUrl: '',
				show: false,
				fab: {
					horizontal: 'right',
					vertical: 'bottom',
					direction: 'horizontal',
					pattern: {
						color: '#7A7E83',
						backgroundColor: '#fff',
						selectedColor: '#007AFF',
						buttonColor: "#007AFF"
					}
				},
				isCreator: false
			}
		},
		onLoad(e) {
			this.id = e.id || 1;
		},
		onShow() {
			this._loadActivity()
		},
		onPullDownRefresh() {
			this._loadActivity()
		},
		methods: {
			join: function() {
				let user = this.$store.state.userinfo
				if (!user.isRegisted) {
					this.show = true
					return
				}
				var participants = []
				if (this.activity.activityParticipants && this.activity.activityParticipants.length > 0) {
					participants = this.activity.activityParticipants.filter(obj => obj.userInfoId === user.id)
				}
				if (participants.length > 0) {
					uni.showToast({
						icon: 'none',
						title: '已经报名'
					})
					return
				}

				uni.navigateTo({
					url: '/pages/yueqiu/activity/join?id=' + this.id
				})
			},
			onClose: function() {
				this.show = false
			},
			onQrcode: async function(e) {
				if (!this.qrcodeUrl) {
					var {
						data
					} = await http.post(`/util/qrcode`, {item1: `?id=${this.activity.id}`, item2: 'pages/yueqiu/activity/activity'})
					this.qrcodeUrl = data.result
				}
				this.showQrcode = true
			},
			onCloseQrcode: function() {
				this.showQrcode = false
			},
			toPeople: function(item) {
				uni.setStorageSync('page-people', item)
				let url = 'joinPeople'
				if (this.$store.state.userinfo.id === item.userInfoId) {
					url = 'editStatus'
				}
				uni.navigateTo({
					url
				})
			},
			onEdit: function() {
				uni.setStorageSync("page-activity", this.activity)
				uni.navigateTo({
					url: '/pages/yueqiu/activity/editactivity'
				})
			},
			onDelete: function() {
				var self = this;
				uni.showModal({
					content: '确定删除活动吗？',
					success: async function(res) {
						if (!res.confirm) return
						await http.delete("/activity/" + self.activity.id);
						uni.showToast({
							title: '删除成功'
						});
						uni.$emit('delete-activity', this.activity)
					}
				});
			},
			joinStatus: function(status) {
				return joinStatus[status];
			},
			activityTime: function(time) {
				if (!time) return '';
				let date = time.slice(0, 16);
				return date + ' ' + dateUtils.getWeek(time)
			},
			toLocation() {
				uni.openLocation({
					name: this.activity.location,
					address: this.activity.address,
					longitude: this.activity.lng,
					latitude: this.activity.lat
				})
			},
			back: function(e) {
				uni.switchTab({
					url: '/pages/tabBar/home'
				});
			},
			_loadActivity() {
				let self = this;
				http.get('/activity/' + this.id)
					.then(function({
						data
					}) {
						self.activity = data.result
						self.isCreator = self.activity.userInfoId === self.$store.state.userinfo.id
						uni.stopPullDownRefresh()
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.data.message
						})
						uni.stopPullDownRefresh()
					})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		// padding: 20upx;
	}

	view {
		background-color: #fff;
	}

	.player-container {
		font-size: 80%;
		padding: 20upx;
		background-color: #fff;

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
				width: 100upx;
				height: 100upx;
				margin-right: 20upx;

				image {
					width: 100upx;
					height: 100upx;
				}
			}

			.player-info {
				display: flex;
				flex-flow: column;
				flex-grow: 1;

				view {
					padding: 2upx 0;
				}

				.play-time {
					color: #777;
					font-size: 80%;
				}
			}

			.jdcat-right {
				color: #777;
			}

			>text {
				vertical-align: middle;
			}
		}

		.player:last-child {
			border-bottom: none;
		}
	}

	.activity-func {
		display: flex;
		flex-flow: column;
		justify-content: center;
		border-top: 20upx solid #ddd;
		padding-top: 20upx;

		.activity-time {
			color: #777;
			text-align: center;
		}

		.button {
			width: 100%;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			margin-top: 40upx;

			button {
				width: 35%;
			}
		}
		
		.button-qrcode {
			display: flex;
			flex-flow: column;
		}
		
	}

	.activity-operate {
		display: flex;
		flex-flow: column;
		padding: 60upx 20upx;

		.desc {
			color: #777;
		}

		button {
			width: 90%;
			margin-top: 40upx;
		}
	}
	
	.bg-green {
		// border: 1upx solid #0067D8;
		background-color: #ff9900 !important;
	}
</style>
