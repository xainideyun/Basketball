<template>
	<view class="list">
		<ad unit-id="adunit-2412e37f507a6d4a"></ad>
		<view class="list-item" v-for="(item, index) in list" :key='index' @tap="onClick(item)">
			<view class="list-data">
				<view class="team">
					<view class="logo">
						<text class="jdcat jdcat-basketball"></text>
					</view>
					<view class="host">
						<text class="name">{{item.host}}</text>
						<text class="score">{{item.hostScore}}</text>
					</view>
					<view class="vs">
						<text>vs</text>
					</view>
					<view class="visitor">
						<text class="score">{{item.visitorScore}}</text>
						<text class="name">{{item.visitor}}</text>
					</view>
				</view>
				<view class="note">
					<view class="other">
						<text class="tip" style="color: red;">本场得分：{{item.score}}</text>
						<text class="tip">比赛时间：{{item.startTime || '未开始'}}</text>
					</view>
					<view class="navigate">
						<text class="jdcat jdcat-right"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-if="list.length === 0">
			<text>没有参与过任何比赛。</text>
		</view>
		<view class="empty" v-if="list.length > 0 && !hasData">
			<text>没有更多了。</text>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		data() {
			return {
				list: [],
				hasData: true,
				paging: {
					pageIndex: 1,
					maxScore: 999999999,
					pageSize: 10
				}

			}
		},
		onLoad: async function() {
			await this._loadData()

		},
		onReachBottom: async function () {
				if (!this.hasCreateList) return
				this.paging.maxScore = this.list[this.list.length - 1].id - 1
				await this._loadData()
		},
		methods: {
			onClick(entity) {
				// console.log(entity);
				uni.navigateTo({
					url: '/pages/my/mydata-detail?id=' + entity.id
				})
			},
			_loadData: async function() {
				if (!this.hasData) return
				var {
					data
				} = await http.get(
					`/user/match/${this.$store.state.userinfo.id}?pageIndex=${this.paging.pageIndex}&maxScore=${this.paging.maxScore}&pageSize=${this.paging.pageSize}`
				)
				if (data.length === 0 && data.length < this.paging.pageSize) {
					this.hasData = false
				}
				if (data.length === 0) return
				let self = this
				data.forEach(item => self.list.push(item))
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #efeff4;
	}
	.list {
		display: flex;
		flex-flow: column;
		width: 750upx;

		.list-item {
			width: 100%;
			border-bottom: 6upx solid #eee;
			display: flex;
			flex-flow: row nowrap;
			align-items: stretch;
			padding: 10upx;
			background-color: #fff;
			
			&:last-child {
				border-bottom: 2upx solid #eee;
			}
		}
		
		.list-data {
			flex-grow: 1;
			display: flex;
			flex-flow: column;
		}

		.team {
			height: 70upx;
			display: flex;
			flex-flow: row nowrap;

			.logo {
				width: 60upx;
				color: $uni-color-primary;
				font-size: 40upx;
				line-height: 70upx;
			}

			.host {
				width: 310upx;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;

			}

			.vs {
				text-align: center;
				line-height: 70upx;
				width: 50upx;
				color: $uni-color-success;
			}

			.visitor {
				width: 310upx;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;

				.name {
					text-align: right;
				}
			}

			.name {
				width: 300upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.score {
				width: 50upx;
				text-align: center;
			}
		}
	}

	.note {
		display: flex;
		flex-flow: row nowrap;
		
		.other {
			flex-grow: 1;
			display: flex;
			flex-flow: column;
		}
	}

	.tip {
		color: #777;

	}

	.navigate {
		width: 60upx;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		color: #777;
	}

	.empty {
		text-align: center;
		flex-grow: 1;
		margin: 50upx 0;
		color: #777;
	}
	
	.jdcat-basketball {
		font-size: 40upx;
	}
</style>
