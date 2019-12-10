<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#007aff" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-show="current === 0" class="list">
				<view v-if="joinList.length > 0">
					<view class="list-item" v-for="(item, index) in joinList" :key='index' @tap="toDetail(item)">
						<view class="info">
							<view class="team">
								<text class="jdcat jdcat-host"></text>
								<text class="name">{{item.hostName}}</text>
								<text class="score">{{item.hostScore}}分</text>
							</view>
							<view class="team">
								<text class="jdcat jdcat-visitor"></text>
								<text class="name">{{item.visitorName}}</text>
								<text class="score">{{item.visitorScore}}分</text>
							</view>
							<text class="tip">比赛时间：{{item.createTime}}</text>
							<text class="tip">比赛地点：{{item.location}}</text>
						</view>
						<view class="navigate">
							<text class="jdcat jdcat-right"></text>
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
			<view v-show="current === 1" class="list">
				<view v-if="createList.length > 0">
					<view class="list-item" v-for="(item, index) in createList" :key='index' @tap="toDetail(item)">
						<view class="info">
							<view class="team">
								<text class="jdcat jdcat-host"></text>
								<text class="name">{{item.hostName}}</text>
								<text class="score">{{item.hostScore}}分</text>
							</view>
							<view class="team">
								<text class="jdcat jdcat-visitor"></text>
								<text class="name">{{item.visitorName}}</text>
								<text class="score">{{item.visitorScore}}分</text>
							</view>
							<text class="tip">比赛时间：{{item.createTime}}</text>
							<text class="tip">比赛地点：{{item.location}}</text>
						</view>
						<view class="navigate">
							<text class="jdcat jdcat-right"></text>
						</view>
					</view>
				</view>
				<view class="empty" v-else>
					<text>没有创建过任何比赛。</text>
				</view>
				<view class="empty" v-if="createList.length > 0 && !hasCreateList">
					<text>没有更多了。</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				current: 0,
				items: ['我参与的', '我创建的'],
				userId: 0,
				createList: [],								// 我创建的比赛列表对象
				hasCreateList: true,					// 创建的比赛列表是否还有数据没有加载
				createPaging: {								// 创建的比赛分页对象
					pageIndex: 1,
					maxScore: 999999999,
					pageSize: 10
				},
				joinList: [],									// 我参与过的比赛列表
				hasJoinList: true,						// 我参与过的比赛是否还有数据没有加载
				joinPaging: {									// 我参与过的比赛分页对象
					pageIndex: 1,
					maxScore: 999999999,
					pageSize: 10
				},
				createListloaded: false					// 第一次点击到我创建的比赛选项卡时，加载列表
			}
		},
		onLoad: async function(e) {
			this.userId = this.$store.state.userinfo.id
			await this._loadJoinList()
			
			uni.$on("matchStatusChange", function(match) {
				var item = this.createList.find(a => a.id === match.id)
				if (item) item.status = match.status
				item = this.joinList.find(a => a.id === match.id)
				if (item) item.status = match.status
			}.bind(this))
		},
		onReachBottom: async function() {
			if (this.current === 0) {
				if (!this.hasCreateList) return
				this.createPaging.maxScore = this.createList[this.createList.length - 1].id - 1
				await this._loadCreate()
			} else {
				if (!this.hasJoinList) return
				this.joinPaging.maxScore = this.joinList[this.joinList.length - 1].id - 1
				await this._loadJoinList()
			}
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index
				}
				if (this.createListloaded) return
				this._loadCreate()
				this.createListloaded = true
			},
			toDetail: async function (match){
				var user = this.$store.state.userinfo
				if (match.status === 2) {
					uni.navigateTo({
						url: '/pages/home/match/detail?id=' + match.id
					})
					return
				}
				var {data} = await http.get(`/match/teams/${match.id}`)
				var mana = data.find(a => a.userInfoId === user.id && a.name !== '客队')
				if (!mana) {
					uni.navigateTo({
						url: '/pages/home/match/detail?id=' + match.id
					})
					return
				}
				uni.navigateTo({
					url: '/pages/home/match/single?id=' + match.id
				})
			},
			_loadCreate: async function() {
				var self = this
				var {
					data
				} = await http.get(
					`/match/create/${this.userId}?pageIndex=${this.createPaging.pageIndex}&maxScore=${this.createPaging.maxScore}&pageSize=${this.createPaging.pageSize}`
				)
				if (data.length === 0) {
					this.hasCreateList = false
					return
				}
				if (data.length < this.createPaging.pageSize) {
					this.hasCreateList = false
				}
				data.forEach(a => self.createList.push(a))
			},
			_loadJoinList: async function() {
				var self = this
				var {
					data
				} = await http.get(
					`/match/join/${this.userId}?pageIndex=${this.joinPaging.pageIndex}&maxScore=${this.joinPaging.maxScore}&pageSize=${this.joinPaging.pageSize}`
				)
				if (data.length === 0) {
					this.hasJoinList = false
					return
				}
				if (data.length < this.joinPaging.pageSize) {
					this.hasJoinList = false
				}
				data.forEach(a => self.joinList.push(a))
			},
			
		},

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
		line-height: inherit;
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
			border-top: 1px solid #eee;
			padding: 20upx;
			background-color: #fff;
			display: flex;
			flex-flow: row nowrap;
	
			.info {
				flex-grow: 1;
				display: flex;
				flex-flow: column;
				align-items: stretch;
				width: 600upx;
				
				text {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.team {
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					
					.name {
						flex-grow: 1;
						font-size: 1.2em;
					}
				}
				.tip {
					margin-top: 10upx;
					color: #777;
				}
			}
			
			.navigate {
				width: 60upx;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				color: #777;
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
	
	.jdcat-host {
		color:#007AFF;
		margin-right: 10upx;
	}
	.jdcat-visitor {
		margin-right: 10upx;
		color: red;
	}
	
</style>
