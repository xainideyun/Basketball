<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#007aff" @clickItem="onClickItem" />
		</view>
		<view v-show="current === 0" class="info">
			<view class="score">
				<view class="host">
					<text>{{match.hostName || '主队'}}</text>
				</view>
				<view class="result">
					<text>{{match.hostScore || '0'}} : {{match.visitorScore || '0'}}</text>
				</view>
				<view class="visitor">
					<text>{{match.visitorName || '客队'}}</text>
				</view>
			</view>
			<view class="field-content">
				<view class="title">
					<text>比赛信息</text>
				</view>
				<view class="field">
					<text>比赛编码：{{match.code || ''}}</text>
				</view>
				<view class="field">
					<text>创建时间：{{match.createTime || ''}}</text>
				</view>
				<view class="field">
					<text>比赛地点：{{match.location || ''}}（{{match.address || ''}}）</text>
				</view>
				<view class="field">
					<text>比赛状态：<text :style="{color: matchColor}">{{match.status | statusFilter}}</text></text>
				</view>
				<view class="field">
					<text>开始时间：{{match.startTime || ''}}</text>
				</view>
				<view class="field">
					<text>结束时间：{{match.endTime || ''}}</text>
				</view>
				<view class="field">
					<text>比赛耗时：{{match.takeupTime | taketimeFilter}}</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view v-show="current === 1" class="main">
				<view class="area">
					<view class="caption">
						<text>比赛统计</text>
					</view>
					<view class="body">
						<view class="name" style="flex-grow: 1; min-width: 170upx;">
							<view class="header">
								<view class="cell">
									<text>球队</text>
								</view>
							</view>
							<view class="row" v-for="team in match.teams" :key="team.id">
								<view class="cell">
									<text>{{team.name}}</text>
								</view>
							</view>
						</view>
						<scroll-view :scroll-x="true">
							<view class="data" style="width: auto;">
								<view class="header nocolor">
									<view class="cell" v-for="(section, index) in match.sections" :key="index">
										<text>第{{index + 1}}节</text>
									</view>
									<view class="cell">
										<text>全场</text>
									</view>
								</view>
								<view class="row" v-for="team in match.teams" :key="team.id">
									<view class="cell" v-for="(section, index) in match.sections" :key="index">
										<text>{{section.hostScore}}</text>
									</view>
									<view class="cell">
										<text>{{match.hostScore}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="area" v-for="(team, index) in match.teams" :key="index">
					<view class="caption">
						<text>{{team.name}}</text>
					</view>
					<view class="body">
						<view class="name">
							<view class="header">
								<view class="cell">
									<text>球员</text>
								</view>
							</view>
							<view class="row">
								<view class="cell" v-for="(player, index) in team.players" :key="index">
									<text>{{player.name}}</text>
								</view>
							</view>
						</view>
						<scroll-view :scroll-x="true" style="flex-grow: 1;">
							<view class="data">
								<view class="header">
									<view class="cell">
										<text>时间</text>
									</view>
									<view class="cell">
										<text>得分</text>
									</view>
									<view class="cell">
										<text>篮板</text>
									</view>
									<view class="cell">
										<text>助攻</text>
									</view>
									<view class="cell">
										<text>抢断</text>
									</view>
									<view class="cell">
										<text>盖帽</text>
									</view>
									<view class="cell">
										<text>投篮</text>
									</view>
									<view class="cell">
										<text>3分</text>
									</view>
									<view class="cell">
										<text>罚球</text>
									</view>
									<view class="cell">
										<text>失误</text>
									</view>
									<view class="cell">
										<text>犯规</text>
									</view>
								</view>
								<view class="row" v-for="(player, index) in team.players" :key="index">
									<view class="cell">
										<text>{{player.takeupTime | taketimeForMinuteFilter}}</text>
									</view>
									<view class="cell">
										<text>{{player.score}}</text>
									</view>
									<view class="cell">
										<text>{{player.backboard}}</text>
									</view>
									<view class="cell">
										<text>{{player.assists}}</text>
									</view>
									<view class="cell">
										<text>{{player.steals}}</text>
									</view>
									<view class="cell">
										<text>{{player.blockShot}}</text>
									</view>
									<view class="cell">
										<text>{{(player.threePoint + player.twoPoint + player.unTwoPoint + player.unThreePoint) + '-' + (player.threePoint + player.twoPoint)}}</text>
									</view>
									<view class="cell">
										<text>{{(player.threePoint + player.unThreePoint) + '-' + player.threePoint}}</text>
									</view>
									<view class="cell">
										<text>{{(player.onePoint + player.unOnePoint) + '-' + player.onePoint}}</text>
									</view>
									<view class="cell">
										<text>{{player.fault}}</text>
									</view>
									<view class="cell">
										<text>{{player.foul}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<view v-show="current === 2">
				<view class="log">
					<view class="item" v-for="(log, index) in logs" :key="index">
						<view class="people">
							<text class="name">{{log.name}}</text>
							<text class="time">{{log.logTime.slice(11,16)}}</text>
						</view>
						<view class="body">
							<text>{{log.content}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	import {matchStatus} from '@/utils/enum.js'
	import myFilter from '@/utils/filters.js'
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		components: {
			uniSegmentedControl
		},
		data: function() {
			return {
				items: ['比赛信息', '比赛统计', '比赛记录'],
				current: 0,
				match: {},
				logs: [],
				logPaging: {
					pageSize: 10,
					maxScore: 100000000
				},
				hasLogs: true,
				loadedLog: false,
				statusColor: '#000'
			}
		},
		onLoad: async function(e) {
			var id = e.id || 1
			
			// await http.post("/match/record?hostScore=11&visitorScore=22", {name: '华天晓', logTime: new Date(), content: Date.now() + "詹姆斯连得7分，主宰比赛了。[湖人44:21勇士]", category: 1, matchId: 1, userInfoId: 1})
			
			uni.showLoading({
				title: '正在加载...',
				icon: 'none',
				duration: 10000
			})
			var {
				data
			} = await http.get(`/match/detail/${id}`)
			this.match = data
			uni.hideLoading()
		},
		onReachBottom: function() {
			if (this.current != 2 || !this.hasLogs) return
			this.logPaging.maxScore = this.logs[this.logs.length - 1].id - 1
			this._loadLogs()
		},
		computed: {
			matchColor: function() {
				var status = this.match.status || 0
				if (status === 1) return '#4cdc4c'
				else if (status === 2) return 'red'
				else if (status === 3) return '#ea7042'
				return 'black'
			}
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index
				}
				if (this.loadedLog || index !== 2) return
				this._loadLogs()
				this.loadedLog = true
			},
			
			
			_loadLogs: async function() {
				var self = this
				var {data} = await http.get(`/match/record/${this.match.id}?pageIndex=1&maxScore=${this.logPaging.maxScore}&pageSize=${this.logPaging.pageSize}`)
				if (data.length === 0) {
					this.hasLogs = false
					return
				}
				if (data.length < this.logPaging.pageSize) {
					this.hasLogs = false
				}
				data.forEach(a => self.logs.push(a))
			}
		},
		filters: {
			...myFilter,
			statusFilter: function(status) {
				return matchStatus[status || 0]
			}
		}
	}
</script>

<style lang="scss">

	.info {
		height: 100%;
		flex-grow: 1;

		.score {
			margin-top: 20upx;
			display: flex;
			flex-flow: row nowrap;
			height: 150upx;
			align-items: center;
			background-color: #cce8fd;
			color: #000;


			.host,
			.visitor {
				width: 250upx;
				text-align: center;
				font-size: 1.2em;
			}

			.result {
				flex-grow: 1;
				white-space: pre;
				font-size: 1.7em;
				border-left: 1upx solid #fff;
				border-right: 1upx solid #fff;
				align-self: stretch;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.field-content {
			padding: 20upx;
			
			.title {
				border-left: 10upx solid #007AFF;
				padding-left: 20upx;
				font-weight: bold;
				margin-bottom: 20upx;
			}
			.field {
				padding-left: 20upx;
				text-align: left;
				border-top: 1upx solid #ddd;
				padding: 5upx;
				
				.jdcat {
					margin-right: 10upx;
				}
			}
			.field:last-child {
				border-bottom: 1upx solid #ddd;
			}
		}
	}

	.content {
		display: flex;
		flex-flow: column;
		align-items: stretch;
		padding: 20upx;
	}

	.main {
		display: flex;
		flex-flow: column;
		align-items: stretch;

		.area {
			display: flex;
			flex-flow: column;
			align-items: stretch;
			margin-top: 20upx;

			.caption {
				height: 1.7em;
				line-height: 1.7em;
				text-align: center;
				border: 1upx solid #ccc;
			}

			.body {
				display: flex;
				flex-flow: row nowrap;

				.name {
					width: 150upx;
					display: flex;
					flex-flow: column;

					.header {
						border: 1upx solid #ccc;
						border-top: none;
						background-color: orangered;
						color: #fff;
					}

					.row {
						border: 1upx solid #ccc;
						border-top: none;
					}

					.cell {
						border: none;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						border-top: 1upx solid #ccc;
					}
					.cell:first-child {
						border-top: none;
					}
				}

				.data {
					display: flex;
					flex-flow: column;
					width: 1100upx;

					.header {
						display: flex;
						flex-flow: row nowrap;
						border-bottom: 1upx solid #ccc;
						background-color: #007AFF;
						color: #fff;
					}

					.row {
						display: flex;
						flex-flow: row nowrap;
						border-bottom: 1upx solid #ccc;
					}

					.cell {
						width: 100upx;
						border-right: 1upx solid #ccc;
					}
				}
			}

			.cell {
				height: 1.7em;
				line-height: 1.7em;
				text-align: center;
				flex-grow: 1;
			}

			.row:last-child {
				border-bottom: 1upx solid #ccc;
			}

			.cell:first-child {
				flex-grow: 1;
			}

			.cell:last-child {
				border-right: 1upx solid #ccc;
			}

			.nocolor {
				.cell {
					background-color: #FFFFFF;
					color: #000;
				}
			}
		}
	}

	.log {
		display: flex;
		flex-flow: column;
		align-items: stretch;

		.item {
			display: flex;
			flex-flow: row nowrap;
			margin-bottom: 20upx;

			.people {
				min-width: 100upx;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: flex;
				flex-flow: column;
				text-align: right;
				margin-right: 30upx;

				.time {
					color: #aaa;
					font-size: .9em;
					line-height: .9em;
				}
			}

			.body {
				flex-grow: 1;
				position: relative;
				background-color: #c7eaff;
				padding: 20upx;
				border-radius: 10upx;

			}

			.body::after {
				content: '';
				position: absolute;
				top: 20upx;
				left: -10upx;
				width: 20upx;
				height: 20upx;
				transform: rotate(45deg);
				background-color: #c7eaff;
			}
		}
	}

	scroll-view {
		overflow: hidden;
	}
</style>
