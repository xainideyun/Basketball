<template>
	<view class="page main">
		<view class="area">
			<view class="caption">
				<text>比赛统计</text>
			</view>
			<view class="body">
				<view class="name">
					<view class="header">
						<view class="cell">
							<text>球队</text>
						</view>
					</view>
					<view class="row" v-for="team in match.teams" :key="team.id">
						<view class="cell" style="width: 200px;">
							<text>{{team.name}}</text>
						</view>
					</view>
				</view>
				<view class="data">
					<view class="header nocolor">
						<view class="cell" v-for="(section, index) in match.sections" :key="index">
							<text>第{{index + 1}}节</text>
						</view>
						<view class="cell">
							<text>全场</text>
						</view>
					</view>
					<view class="row">
						<view class="cell" v-for="(section, index) in match.sections" :key="index">
							<text>{{section.hostScore}}</text>
						</view>
						<view class="cell">
							<text>{{match.hostScore}}</text>
						</view>
					</view>
					<view class="row">
						<view class="cell" v-for="(section, index) in match.sections" :key="index">
							<text>{{section.visitorScore}}</text>
						</view>
						<view class="cell">
							<text>{{match.visitorScore}}</text>
						</view>
					</view>
				</view>
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
							<view class="cell">
								<text>效率值</text>
							</view>
							<view class="cell">
								<text>正负值</text>
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
								<text>{{(player.threePoint + player.twoPoint) + '-' + (player.threePoint + player.twoPoint + player.unTwoPoint + player.unThreePoint)}}</text>
							</view>
							<view class="cell">
								<text>{{player.threePoint + '-' + (player.threePoint + player.unThreePoint)}}</text>
							</view>
							<view class="cell">
								<text>{{player.onePoint + '-' + (player.onePoint + player.unOnePoint)}}</text>
							</view>
							<view class="cell">
								<text>{{player.fault}}</text>
							</view>
							<view class="cell">
								<text>{{player.foul}}</text>
							</view>
							<view class="cell">
								<text>{{player | efficiencyFilter}}</text>
							</view>
							<view class="cell">
								<text>{{player.getLost}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import myFilter from '@/utils/filters.js'
	export default {
		data() {
			return {
				match: {}
			}
		},
		onLoad() {
			this.match = uni.getStorageSync('landscapeData');
		},
		filters: {
			...myFilter,
			statusFilter: function(status) {
				return matchStatus[status || 0]
			},
			efficiencyFilter: function(player) {
				var val = 0
				val += player.score
				val += player.backboard
				val += player.assists
				val += player.blockShot
				val += player.steals
				val -= player.unThreePoint
				val -= player.unTwoPoint
				val -= player.unOnePoint
				val -= player.fault
				return val;
			}
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-flow: column;
		align-items: flex-start;
	}

	.main {
		display: flex;
		flex-flow: column;
		align-items: stretch;
		
		text {
			font-size: 20upx;
		}

		.area {
			display: flex;
			flex-flow: column;
			align-items: stretch;
			margin-top: 20upx;

			.caption {
				position: relative;
				height: 1.7em;
				line-height: 1.7em;
				text-align: center;
				border: 1upx solid #ccc;

			}

			.body {
				display: flex;
				flex-flow: row nowrap;

				.name {
					width: 200px;
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
	
	
</style>
