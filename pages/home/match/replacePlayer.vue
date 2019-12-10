<template>
	<view class="page">
		<view class="team-info">
			<text>{{name}}</text>
		</view>
		<view class="player-area">
			<view class="players up">
				<view class="title">
					<text>场上球员</text>
				</view>
				<scroll-view :scroll-y="true">
					<view class="list">
						<view class="list-item" :class="{'selected': player.selected}" v-for="player in up" :key="player.id" @tap="onCheck(player)">
							<text>{{player.playNumber}}</text>
							<text>{{player.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="control">
				<text class="jdcat jdcat-replace"></text>
				<button type="primary" size="mini" @tap="onSubmit">确定</button>
			</view>
			<view class="players down">
				<view class="title">
					<text>场下球员</text>
				</view>
				<scroll-view :scroll-y="true">
					<view class="list">
						<view class="list-item" :class="{'selected': player.selected}" v-for="player in down" :key="player.id" @tap="onCheck(player)">
							<text>{{player.playNumber}}</text>
							<text>{{player.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		data: function(){
			return {
				name: '',
				up: [],
				down: []
			}
		},
		onLoad: async function(e) {
			var id = e.id || 3
			this.name = e.name || '主队'
			
			var {data} = await http.get("/match/team/players/" + id)
			if (data.length === 0)return
			data.forEach(a => a.selected = false)
			this.up = data.filter(obj => obj.status === 1)
			this.down = data.filter(obj => obj.status === 0)
			
			uni.$emit("updatePlayer", JSON.parse(JSON.stringify(data)))			// 通知更新球员
		},
		methods: {
			onCheck: function(item) {
				item.selected = !item.selected
			},
			onSubmit: async function() {
				var down = this.up.filter(a => a.selected)
				var up = this.down.filter(a => a.selected)
				if (down.length === 0 && up.length === 0) {
					uni.showToast({
						title: '请选择替换的球员', icon: "none"
					})
					return
				}
				if (down.length != up.length) {
					uni.showModal({
						title: '提示',
						content: '上场球员与下场球员数量不一致，确定替换吗？',
						success(e) {
							if(!e.confirm) return
							uni.$emit("replacePlayer", {up: up, down: down})
							uni.showLoading({
								mask: true, title: '正在处理...'
							})
							setTimeout(() => {
								uni.hideLoading()
								uni.navigateBack()
							}, 1000)
						}
					})
				}
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
	}
	.team-info {
		font-size: 1.5em;
		background-color: #007AFF;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: #fff;
		height: 100upx;
	}
	
	.player-area {
		display: flex;
		flex-flow: row;
		align-items: stretch;
		flex-grow: 1;
		
		.players {
			display: flex;
			flex-flow: column;
			flex-grow: 1;
			align-items: stretch;
			justify-content: stretch;
			width: 280upx;
			border-bottom: 1upx solid #ccc;
			
			.title {
				height: 60upx;
				color: #fff;
				text-align: center;
				line-height: 60upx;
			}
			scroll-view {
				flex-grow: 1;
				height: 500upx;
			}
			.list {
				display: flex;
				flex-flow: column;
				width: 100%;
				
				.list-item {
					display: flex;
					flex-flow: row nowrap;
					justify-content: center;
					align-items: center;
					height: 100upx;
					border-top: 1upx solid #ccc;
					line-height: 35upx;
					
					text:first-child {
						width: 80upx;
						text-align: center;
					}
					text:last-child {
						flex-grow: 1;
						text-align: center;
					}
				}
				.list-item:last-child {
					border-bottom: 1upx solid #ccc;
				}
			}
		}
		
		.control {
			flex-grow: 1;
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;
			
		}
		
		.up {
			border-right: 1upx solid #ccc;
			
			.title {
				background-color: #e40641;
			}
			.selected {
				background-color: #e40641;
				color: #fff;
			}
		}
		.down {
			border-left: 1upx solid #ccc;
			
			.title {
				background-color: #333;
			}
			.selected {
				background-color: #333;
				color: #fff;
			}
		}
	}
	
	.jdcat {
		color: #e40641;
		font-size: 2em;
	}
</style>
