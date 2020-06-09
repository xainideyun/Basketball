<template>
	<view class="page">

		<view class="header">
			<image :src="player.faceUrl" mode="aspectFit"></image>
			<view class="">
				<text>{{player.name}}</text>
			</view>
			<view class="script">
				<text>没错，我就是MVP！</text>
			</view>
		</view>
		<view class="player-data">
			<view class="row">
				<view class="cell">
					<text>得分</text>
					<text>{{player.score}}</text>
				</view>
				<view class="cell">
					<text>篮板</text>
					<text>{{player.backboard}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>助攻</text>
					<text>{{player.assists}}</text>
				</view>
				<view class="cell">
					<text>抢断</text>
					<text>{{player.steals}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>盖帽</text>
					<text>{{player.blockShot}}</text>
				</view>
				<view class="cell">
					<text>投篮</text>
					<text>{{player.twoPoint + player.threePoint}}-{{player.twoPoint + player.threePoint + player.unTwoPoint + player.unThreePoint}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>三分</text>
					<text>{{player.threePoint}}-{{player.threePoint + player.unThreePoint}}</text>
				</view>
				<view class="cell">
					<text>罚球</text>
					<text>{{player.onePoint}}-{{player.onePoint + player.unOnePoint}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>失误</text>
					<text>{{player.fault}}</text>
				</view>
				<view class="cell">
					<text>犯规</text>
					<text>{{player.foul}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>效率值</text>
					<text>{{player | efficiencyFilter}}</text>
				</view>
				<view class="cell">
					<text>正负值</text>
					<text>{{player.getLost}}</text>
				</view>
			</view>
			<view class="row">
				<view class="cell">
					<text>上场时间</text>
					<text>{{player.takeupTime | taketimeFilter}}</text>
				</view>
				<view class="cell">
				</view>
			</view>
		</view>
		<view class="qrcode">
			<image src="../../static/qrcode.jpg" mode="aspectFit"></image>
			<text>篮球爱好者必备工具</text>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	import myFilter from '@/utils/filters.js'

	export default {
		data() {
			return {
				player: {}

			}
		},
		async onLoad(e) {
			var {
				data
			} = await http.get('/user/player/' + (e.id || 131))
			this.player = data
			
			// 在页面中定义激励视频广告
			let videoAd = null
			
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
			  videoAd = wx.createRewardedVideoAd({
			    adUnitId: 'adunit-53082085d23210d6'
			  })
			}
			
			// 用户触发广告后，显示激励视频广告
			if (videoAd) {
			  videoAd.show().catch(() => {
			    // 失败重试
			    videoAd.load()
			      .then(() => videoAd.show())
			      .catch(err => {
			        console.log('激励视频 广告显示失败')
			      })
			  })
			}
			
		},
		onShareAppMessage: function() {
			return {
				title: '篮球爱好者必备工具',
				path: '/pages/my/mydata-detail?id=' + this.player.id
			}
		},
		methods: {

		},
		filters: {
			...myFilter,
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
	page {
		background-color: #fff;
	}

	.page {
		display: flex;
		flex-flow: column;
		align-items: stretch;
		background-color: #fff;
	}

	.header {
		display: flex;
		flex-flow: column;
		align-items: center;

		image {
			width: 100upx;
			height: 100upx;
			margin: 20upx 0;
			border-radius: 50%;
		}

		.script {
			font-size: 1.1em;
			padding: 10upx 20upx;
			border-bottom: 1upx solid #ccc;
			font-weight: 800;
			width: 80%;
			text-align: center;
		}
	}

	.player-data {
		display: flex;
		flex-flow: column;
		align-items: stretch;

		.row {
			display: flex;
			flex-flow: row nowrap;
			margin-top: 20upx;


		}

		.cell {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			margin: 10upx 50upx;
			width: 50%;
		}
	}

	.qrcode {
		position: fixed;
		bottom: 20upx;
		right: 10upx;
		height: 220upx;
		width: 210upx;
		text-align: center;
		font-size: .7em;
		color: #333;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		padding: 5upx;
		border: 1upx solid #333;
		border-radius: 10upx;

		image {
			width: 200upx;
			height: 200upx;
		}
	}
</style>
