<template>
	<view class="page main">
		
		<view class="area">
			<view class="caption">
				<text>比赛统计</text>
			</view>
			<view class="total-box">
				<view class="total-box-qd">
					<view class="total-box-line total-box-color">球队</view>
					<view class="total-box-line" v-for="team in match.teams" :key="team.id">{{team.name}}</view>
				</view>
			
				<view class="total-box-node"style="">
					<view class="node-total">
						<view class="total-box-row"v-for="(section, index) in match.sections" :key="index">
							<view  class="total-box-data ">第{{index + 1}}节</view>
							<view class="total-box-data">{{section.hostScore}}</view>
							<view class="total-box-data">{{section.visitorScore}}</view>
						</view>
						<view  class="total-box-row">
							<view class="total-box-data">全场</view>
							<view class="total-box-data">{{match.hostScore}}</view>
							<view class="total-box-data">{{match.visitorScore}}</view>
						</view>
					</view>
				</view>
			
			</view>

		</view>
		<view class="area" v-for="(team, index) in match.teams" :key="index">
			<view class="caption">
				<text>{{team.name}}</text>
			</view>
			<view class="t-head t-head-color">
				<view class="t-cell t-cell2 t-cell-color">球员</view>
				<view class="t-cell t-cell-color1">时间</view>
				<view class="t-cell t-cell-color1">得分</view>
				<view class="t-cell t-cell-color1">篮板</view>
				<view class="t-cell t-cell-color1">助攻</view>
				<view class="t-cell t-cell-color1">抢断</view>
				<view class="t-cell t-cell-color1">盖帽</view>
				<view class="t-cell t-cell-color1">投篮</view>
				<view class="t-cell  t-cell-color1 t-cell3">3分</view>
				<view class="t-cell t-cell-color1">罚球</view>
				<view class="t-cell t-cell-color1">失误</view>
				<view class="t-cell t-cell-color1">犯规</view>
				<view class="t-cell t-cell1 t-cell-color1">效率值</view>
				<view class="t-cell t-cell1 t-cell-color1">正负值</view>
			</view>
			<view class="t-head"  v-for="(player, index) in team.players" :key="index">
				<view class="t-cell t-cell2">{{player.name}}</view>
				<view class="t-cell">{{player.takeupTime | taketimeForMinuteFilter}}</view>
				<view class="t-cell">{{player.score}}</view>
				<view class="t-cell">{{player.backboard}}</view>
				<view class="t-cell">{{player.assists}}</view>
				<view class="t-cell">{{player.steals}}</view>
				<view class="t-cell">{{player.blockShot}}</view>
				<view class="t-cell">{{(player.threePoint + player.twoPoint) + '-' + (player.threePoint + player.twoPoint + player.unTwoPoint + player.unThreePoint)}}</view>
				<view class="t-cell  t-cell3">{{player.threePoint + '-' + (player.threePoint + player.unThreePoint)}}</view>
				<view class="t-cell">{{player.onePoint + '-' + (player.onePoint + player.unOnePoint)}}</view>
				<view class="t-cell">{{player.fault}}</view>
				<view class="t-cell">{{player.foul}}</view>
				<view class="t-cell t-cell1">{{player | efficiencyFilter}}</view>
				<view class="t-cell t-cell1">{{player.getLost}}</view>
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
		width:100%;overflow-x: hidden
	}
	
	.total-box{
		width: 100%;
		text-align:center;
		background-color: #fff;
		font-weight: normal;
		
		.total-box-qd{
			width:200rpx;float: left;
			.total-box-color{background-color: orangered;}
			.total-box-line{
				border-bottom: 1px #f1f1f1 solid;
				height: 40px;line-height: 40px;
				font-size: 16rpx;
				}
		}
		.total-box-node{
			margin-left:200rpx;
			.node-total{
				width: 100%;
				display: flex;flex : row nowrap;border-left:2rpx #f1f1f1 solid ;
			}
		}
		.total-box-row{
			
			flex-grow:1;
			border-bottom: 1px #f1f1f1 solid;
			
			border-left:2rpx #f1f1f1 solid ;
			margin-left: -2rpx;
			.total-box-data{
				height: 40px;line-height: 40px;
				border-bottom: 1px #f1f1f1 solid;
				font-size: 16rpx;
			}
		}
		
	}
	
	.t-head{
		width: 750rpx;
		height: 40rpx;
		border-bottom: #f1f1f1 2rpx solid;
		background-color: #fff;
		.t-cell{
			width: 49rpx;
			height: 40rpx;
			line-height: 40rpx;
			float: left;
			text-align: center;
			border-left:2rpx #f1f1f1 solid;
			margin-left: -2rpx;
			color: #000;
			font-size: 16rpx;
			overflow: hidden;
			
		}
		.t-cell1{
			width: 60rpx;
		}
		.t-cell2{
			width: 102rpx;
		}
		.t-cell3{
			width: 40rpx;
		}
		.t-cell-color{background-color: orangered;}
		.t-cell-color1{color: #fff;}
	}
	.t-head-color{background-color: #007AFF;}
	.main {
		display: flex;
		flex-flow: column;
		align-items: stretch;
		
		text {
			font-size: 20upx;
		}

		.area {
			clear: both;
			margin-top: 20rpx;

			.caption {
				clear: both;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				border: 1px #dadada solid;
			}
		}
	}
	
	
</style>
