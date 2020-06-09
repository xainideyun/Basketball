<template>
	<view>
		<ad unit-id="adunit-2412e37f507a6d4a"></ad>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#007aff" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-show="current === 0" class="list">
				<view v-if="myList.length > 0">
					<view class="list-item" v-for="(item, index) in myList" :key='index' @tap="toDetail(item)">
						<view class="field-item">
							<text class="jdcat jdcat-basketball"></text>
							<view class="title field-content">
								<text class="name">{{item.title}}</text>
								<text class="creator">{{item.name}}</text>
							</view>
						</view>
						<view class="field-item">
							<text class="jdcat jdcat-time"></text>
							<text class="field-content">{{activityTime(item.activityTime)}}</text>
							<text class="jdcat jdcat-right"></text>
						</view>
						<view class="field-item">
							<text class="jdcat jdcat-address"></text>
							<text class="field-content">{{item.location}}</text>
						</view>
						<view style="text-align: center; margin-top: 20upx;">
							共<text class="text-green">{{item.quantity}}</text>人报名，
							参加<text class="text-green">{{item.joinQuantity}}</text>人，
							待定<text class="text-red">{{item.absentQuantity}}</text>人，
							缺席<text class="text-red">{{item.pendingQuantity}}</text>人
						</view>
						<view style="text-align: center; color: #aaa; margin-top: 20upx;">
							<text>创建时间：{{item.createTime}}</text>
						</view>
						<view class="badge" :class="{'bg-red': item.status === 2, 'bg-green': item.status === 1, 'bg-gray': item.status === 4}">
							<text>{{filerStatus(item.status)}}</text>
						</view>
					</view>
				</view>
				<view class="empty" v-else>
					<text>没有发布过任何报名活动。</text>
				</view>
				<view class="empty" v-if="myList.length > 0 && !hasMylist">
					<text>没有更多了。</text>
				</view>
			</view>
			<view v-show="current === 1" class="list">
				<view v-if="joinList.length > 0">
					<view class="list-item" v-for="(item, index) in joinList" :key='index' @tap="toDetail(item)">
						<view class="field-item">
							<text class="jdcat jdcat-basketball"></text>
							<view class="title field-content">
								<text class="name">{{item.title}}</text>
								<text class="creator">{{item.name}}</text>
							</view>
						</view>
						<view class="field-item">
							<text class="jdcat jdcat-time"></text>
							<text class="field-content">{{activityTime(item.activityTime)}}</text>
							<text class="jdcat jdcat-right"></text>
						</view>
						<view class="field-item">
							<text class="jdcat jdcat-address"></text>
							<text class="field-content">{{item.location}}</text>
						</view>
						<view style="text-align: center; margin-top: 20upx;">
							共<text class="text-green">{{item.quantity}}</text>人报名，
							参加<text class="text-green">{{item.joinQuantity}}</text>人，
							待定<text class="text-red">{{item.absentQuantity}}</text>人，
							缺席<text class="text-red">{{item.pendingQuantity}}</text>人
						</view>
						<view style="text-align: center; color: #aaa; margin-top: 20upx;">
							<text>创建时间：{{item.createTime}}</text>
						</view>
						<view class="badge" :class="{'bg-red': item.status === 2, 'bg-green': item.status === 1, 'bg-gray': item.status === 4}">
							<text>{{filerStatus(item.status)}}</text>
						</view>
					</view>
				</view>
				<view class="empty" v-else>
					<text>没有参与过任何活动。</text>
				</view>
				<view class="empty" v-if="joinList.length > 0 && !hasJoinList">
					<text>没有更多了。</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	import {
		dateUtils
	} from "@/utils/util.js"
	import {
		activityStatus
	} from "@/utils/enum.js"
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				current: 1,
				items: ['我发布的', '我参与的'],
				myList: [],
				myListPaging: {
					pageSize: 10,
					pageIndex: 1,
					maxScore: 100000000
				},
				hasMylist: true,
				joinList: [],
				hasJoinList: true,
				joinListPaging: {
					pageSize: 10,
					pageIndex: 1,
					maxScore: 100000000
				},
				myListloaded: false
			}
		},
		onLoad(e) {
			let self = this
			// this.loadMyActivity()
			this.loadJoinList()
			// 监听活动删除
			uni.$on('delete-activity', function(data) {
				let num = 0;
				self.myList.find(function(obj, index) {
					if (obj.id === data.id) {
						num = index;
					}
				})
				self.myList.splice(num, 1)
			})
			uni.$on('modify-activity', function(data) {
				let num = 0;
				self.myList.find(function(obj, index) {
					if (obj.id === data.id) {
						num = index;
					}
				})
				self.myList.splice(num, 1, data)
			})
		},
		onUnload() {
			// 删除监听
			uni.$off('delete-activity')
			uni.$off('modify-activity')
		},
		onReachBottom: function() {
			if (this.current === 1) {
				if (!this.hasMylist) return
				this.myListPaging.maxScore = this.myList[this.myList.length - 1].id - 1
				this.loadMyActivity()
			} else {
				if (!this.hasJoinList) return
				this.joinListPaging.maxScore = this.joinList[this.joinList.length - 1].id - 1
				this.loadJoinList()
			}
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index
				}
				if (this.myListloaded) return
				this.loadMyActivity()
				this.myListloaded = true
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/yueqiu/activity/activity?id=' + item.id
				})
			},
			loadMyActivity() {
				let user = uni.getStorageSync('userinfo');
				let self = this;
				http.get(
						`/activity/create/${user.id}?pageIndex=${this.myListPaging.pageIndex}&maxScore=${this.myListPaging.maxScore}&pageSize=${this.myListPaging.pageSize}`
					)
					.then(function(res) {
						if (res.data.code > 0) {
							uni.showToast({
								title: err.data.message,
								icon: 'none'
							})
							return
						}
						if (!res.data.result) {
							self.hasMylist = false;
							return;
						}
						if (res.data.result.length < self.myListPaging.pageSize) {
							self.hasMylist = false;
						}
						let now = new Date();
						res.data.result.forEach(function(obj) {
							// 活动状态重新赋值
							if (obj.status != 4) {
								obj.status = now >= new Date(obj.activityTime.replace(/-/g, '/')) ? 2 : 1;
							}
							self.myList.push(obj)
						});
					})
					.catch(function(err) {
						uni.showToast({
							title: err.data.message,
							icon: 'none'
						})
					})

			},
			loadJoinList() {
				let user = this.$store.state.userinfo
				let self = this
				http.get(
						`/activity/join/${user.id}?pageIndex=${this.joinListPaging.pageIndex}&pageSize=${this.joinListPaging.pageSize}&maxScore=${this.joinListPaging.maxScore}`
					)
					.then(function(res) {
						if (!res.data.result) {
							self.hasJoinList = false;
							return;
						}
						if (res.data.result.length < self.joinListPaging.pageSize) {
							self.hasJoinList = false;
						}
						let now = new Date();
						res.data.result.forEach(function(obj) {
							// 活动状态重新赋值
							if (obj.status != 4) {
								obj.status = now >= new Date(obj.activityTime.replace(/-/g, '/')) ? 2 : 1;
							}
							self.joinList.push(obj)
						});
					})
					.catch(function(err) {
						uni.showToast({
							title: err.data.message,
							icon: 'none'
						})
					})


			},
			activityTime: function(time) {
				if (!time) return '';
				let date = time.slice(0, 16);
				return date + ' ' + dateUtils.getWeek(time)
			},
			filerStatus(status) {
				return activityStatus[status]
			}

		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.uni-common-mt {
		margin-top: 20upx;
	}

	.content {
		display: flex;
		align-items: stretch;
	}

	.list {
		display: flex;
		flex-flow: column;
		margin-top: 20upx;
		flex-grow: 1;

		.list-item {
			position: relative;
			border-top: 1px solid #eee;
			padding: 20upx;
			background-color: #fff;

			.title {
				display: flex;
				flex-flow: column;

				.name {
					font-size: 1.4em;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					max-width: 450upx;
				}

				.creator {
					color: #777;
				}
			}

			.badge {
				position: absolute;
				right: 20upx;
				top: 40upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 60upx;
				width: 5em;
				height: 2.5em;
			}
		}

		.list-item:first-child {
			border-top: none;
		}
	}

	.empty {
		text-align: center;
		flex-grow: 1;
		margin: 50upx 0;
		color: #777;
	}

	// .field-item {
	// 	padding: 10upx 0;
	// 	display: flex;
	// 	flex-flow: row nowrap;
	// 	justify-content: center;
	// 	flex-grow: 1;

	// 	.field-content {
	// 		flex-grow: 1;
	// 	}

	// 	.jdcat {
	// 		margin-right: 20upx;
	// 		color: #777;
	// 	}

	// }

	.jdcat-basketball {
		font-size: 3.3em;
		width: auto !important;
		margin-right: 20upx;
		color: $uni-color-primary !important;
	}

	.bg-green,
	.bg-red {
		color: #fff;
	}

	.bg-gray {}
</style>
