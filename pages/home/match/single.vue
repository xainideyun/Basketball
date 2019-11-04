<template>
	<view class="page">
		<view class="match">
			<view class="team">
				<text class="title">{{match.hostName || '主队'}}</text>
				<text class="score">{{match.hostScore || '0'}}</text>
				<view class="data">
					<view class="data-item">
						<text class="data-title">犯规</text>
						<text>{{teams[0] | foulFilter}}</text>
					</view>
					<view class="data-item">
						<text class="data-title">暂停</text>
						<text>{{teams[0] | pauseFilter}}</text>
					</view>
				</view>
			</view>
			<view class="match-info">
				<text class="title">{{section.partNumber ? `第${section.partNumber}节` : ' '}}</text>
				<text class="time">{{section.takeupTime | taketimeForMinuteFilter}}</text>
				<text class="match-operate" :class="[matchStatusComputed]">{{match.status | statusFilter}}</text>
			</view>
			<view class="team">
				<text class="title">{{match.visitorName || '客队'}}</text>
				<text class="score">{{match.visitorScore || '0'}}</text>
				<view class="data">
					<view class="data-item">
						<text class="data-title">犯规</text>
						<text>{{teams[1] | foulFilter}}</text>
					</view>
					<view class="data-item">
						<text class="data-title">暂停</text>
						<text>{{teams[1] | pauseFilter}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="teams">
			<view class="team team-left">
				<view class="caption">
					<text class="data">分/板/助/帽</text>
					<text class="info">姓名</text>
					<text class="number">号码</text>
				</view>
				<scroll-view :scroll-y="true">
					<view class="players">
						<view class="player" v-for="(player, index) in upPlayers1" :key="index">
							<text class="data">{{player.score}}/{{player.backboard}}/{{player.assists}}/{{player.blockShot}}</text>
							<view class="info">
								<text class="name">{{player.name}}</text>
								<view class="foul" v-if="player.foul > 0">
									<text class="foul-item" v-for="item in player.foul" :key="item"></text>
								</view>
							</view>
							<text class="number">{{player.playNumber}}</text>
						</view>
					</view>
				</scroll-view>
				<view class="team-operate">
					<text @tap="onJoin()">加入</text>
					<text @tap="onReplace()">替换</text>
				</view>
			</view>
			<view class="team team-right">
				<view class="caption">
					<text class="number">号码</text>
					<text class="info">姓名</text>
					<text class="data">分/板/助/帽</text>
				</view>
				<scroll-view scroll-y="true">
					<view class="players">
						<view class="player" v-for="(player, index) in upPlayers2" :key="index">
							<text class="number">{{player.playNumber}}</text>
							<view class="info">
								<text class="name">{{player.name}}</text>
								<view class="foul" v-if="player.foul > 0">
									<text class="foul-item" v-for="item in player.foul" :key="item"></text>
								</view>
							</view>
							<text class="data">{{player.score}}/{{player.backboard}}/{{player.assists}}/{{player.blockShot}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="bottom-operate">
			<text>查看记录</text>
			<text @tap="onControl()">比赛操作</text>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '../../../utils/luch-request/index.js'
	import myFilter from '@/utils/filters.js'
	import myEnum from '@/utils/enum.js'
	import {
		jdcat,
		awaitWrap
	} from '@/utils/util.js'

	var uploadTimeId, matchTimeId
	export default {
		data() {
			return {
				match: {},
				section: {},
				teams: [],
				players: [],
				buttons: []
			}
		},
		onLoad: async function(e) {

			var self = this
			uni.showLoading({
				title: '正在加载...',
				mask: true
			})
			var {
				data
			} = await http.get('/match/detail/' + (e.id || 1))
			var section = (data.sections || []).length > 0 ? (data.sections.find(a => a.status === 1 || a.status === 3) || {}) :
				{}
			section.match = null
			section.isModify = false
			this.section = section // 设置当前节

			var players = []
			data.teams.forEach(function(team) {
				if (!team.players) return
				team.players.forEach(player => {
					player.isModify = false
					players.push(player)
				})
				team.players = null
				team.match = null
				team.isModify = false
			})
			this.players = players || [] // 设置比赛成员
			this.teams = data.teams // 设置比赛球队

			data.teams = null
			data.sections = null
			data.isModify = false
			this.match = data // 设置比赛对象
			if (this.match.status === 1) {
				this._start()
			}
			if (this.match.status !== 2) {
				this._startUpload() // 定时上传比赛数据
			}
			this._listen() // 监听系统事件
			uni.hideLoading()
		},
		onUnload: async function() {
			// 页面卸载时，上传统计数据
			await this._upload()
			// 关闭定时
			clearTimeout(uploadTimeId)
			clearInterval(matchTimeId)
			// 关闭监听
			uni.$off("updatePlayer")
			uni.$off("replacePlayer")
		},
		computed: {
			matchStatusComputed: function() {
				var status = this.match.status || 0
				console.log(status);
				if (status === 0) return 'gray'
				else if (status === 1) return 'green'
				else 'red'
			},
			upPlayers1: function() {
				if (this.players.length === 0) return []
				var team = this.teams[0]
				if (!team) return []
				return this.players.filter(a => a.teamId === team.id && a.status === 1)
			},
			upPlayers2: function() {
				if (this.players.length === 0) return []
				var team = this.teams[1]
				if (!team) return []
				return this.players.filter(a => a.teamId === team.id && a.status === 1)
			}
		},
		methods: {
			onJoin() {
				var team = this.teams[0]
				uni.navigateTo({
					url: `/pages/home/match/joinQrcode?id=${team.id}&name=${team.name}`
				})
			},
			onReplace() {
				var team = this.teams[0];
				uni.navigateTo({
					url: `/pages/home/match/replacePlayer?id=${team.id}&name=${team.name}`
				})
			},
			onControl() {
				var team1 = this.teams[0],
					team2 = this.teams[1],
					self = this
				this.buttons = []
				if (this.match.status === 0) {
					this.buttons.push({
						name: '开始比赛',
						method: 'onStartMatch'
					})
				} else if (this.match.status === 1) {
					this.buttons.push({
						name: `${team1.name}-请求暂停`,
						obj: team1,
						method: 'onPause'
					})
					this.buttons.push({
						name: `${team2.name}-请求暂停`,
						obj: team2,
						method: 'onPause'
					})
					this.buttons.push({
						name: `比赛暂停`,
						method: 'onPause'
					})
					this.buttons.push({
						name: `本节结束`,
						method: 'onEndSection'
					})
					this.buttons.push({
						name: '比赛结束',
						method: 'onEnd'
					})
				} else if (this.match.status === 2) {
					this.buttons.push({
						name: '返回',
						method: 'onBack'
					})
				} else if (this.match.status === 3) {
					this.buttons.push({
						name: '继续比赛',
						method: 'onContinue'
					})
					this.buttons.push({
						name: '比赛结束',
						method: 'onEnd'
					})
				} else {
					this.buttons.push({
						name: '下一节',
						method: 'onNextSection'
					})
					this.buttons.push({
						name: '比赛结束',
						method: 'onEnd'
					})
				}
				uni.showActionSheet({
					itemList: this.buttons.map(a => a.name),
					success(e, b) {
						var button = self.buttons[e.tapIndex]
						self[button.method](button.obj)
					}
				})
			},
			onStartMatch: async function() { // 开始比赛
				uni.showLoading({
					title: '请稍等',
					mask: true
				})
				var {
					data
				} = await http.put("/match/start/" + this.match.id)
				var section = data.sections[0],
					now = Date.now()
				section.match = null
				section.isModify = false
				this.section = section
				data.sections = null
				data.isModify = false
				this.match = data
				this.section.continueTime = now
				this.match.continueTime = now
				uni.hideLoading()
				this._start();
			},
			onPause(team) { // 比赛暂停
				this._pause(team)
			},
			onEndSection: async function() { // 结束本节
				uni.showModal({
					title: '提示',
					content: '确定结束本节比赛吗？',
					success: async function(e) {
						if (!e.confirm) return
						this.section.status = 2
						this.section.isModify = true
						this.match.status = 4
						this.match.isModify = true
						clearInterval(matchTimeId)
						await this._upload(true)
						// await this._pause()
					}.bind(this)
				})
			},
			onNextSection: async function() { // 下一节
				uni.showLoading({
					title: '请稍等',
					mask: true
				})

				var {
					data
				} = http.put("/match/next/" + this.section.id)
				var section = data.result
				section.isModify = false
				this.section = section
				this.match.continueTime = Date.now()
				this.match.status = 1
				this._start()

				uni.hideLoading()
			},
			onBack() { // 返回上级页面
				uni.navigateBack()
			},
			onContinue: async function() { // 继续比赛
				var {
					data
				} = await http.put("/match/continue/" + this.section.id)
				var now = data.result
				this.match.continueTime = now
				this.section.continueTime = now
				this.players
					.filter(a => a.status === 1)
					.forEach(a => a.continueTime = now)
				this._start()
			},
			onEnd() { // 结束比赛
				var self = this
				uni.showModal({
					title: '提示',
					content: '确定结束比赛吗？',
					success: async function(e) {
						if (!e.confirm) return
						clearInterval(matchTimeId)
						self.match.status = 2
						self.match.isModify = true
						self.section.status = 2
						self.section.isModify = true
						await self._upload()
						clearTimeout(uploadTimeId)
					}
				})
			},
			_listen: async function() {
				var self = this
				// 监听球员更新
				uni.$on("updatePlayer", function(players) {
					if (players.length === 0) return
					players.forEach(player => {
						var item = self.players.find(a => a.id === player.id)
						if (item) return
						self.players.push(player)
					})
				})
				// 监听球员替换
				uni.$on("replacePlayer", async function({
					up,
					down
				}) {
					var items = []
					up.forEach(player => {
						var item = self.players.find(a => a.id === player.id);
						if (!item) return
						item.status = 1
						item.continueTime = Date.now()
						item.isModify = true
						// items.push(item)
					})
					down.forEach(player => {
						var item = self.players.find(a => a.id === player.id);
						if (!item) return
						item.status = 0
						item.isModify = true
						// items.push(item)
					})
					await self._upload()
					// http.post("/match/change", items)

				})
			},
			_start: function() {
				var now = Date.now()
				this.match.takeupTime += now - this.match.continueTime
				this.section.takeupTime += now - this.section.continueTime
				this.players
					.filter(player => player.status === 1)
					.forEach(player => {
						player.takeupTime += now - player.continueTime
					})

				matchTimeId = setInterval(function() { // 此函数用来记录比赛耗时
					var now = Date.now()
					this.match.takeupTime += 1000
					this.match.continueTime = now
					this.section.takeupTime += 1000
					this.section.continueTime = now
					this.players
						.filter(player => player.status === 1)
						.forEach(player => {
							player.takeupTime += 1000
							player.continueTime = now
						})
				}.bind(this), 1000)
			},
			_pause: async function(team) {
				var url = "/match/pause/" + this.match.id
				if (team) {
					url += "?teamId=" + team.id
				}
				var {
					data
				} = await http.put(url)
				if (!data.result) {
					jdcat.showError('网络错误')
					return
				}
				clearInterval(matchTimeId)
				this.match.status = 3
				this.match.isModify = true
				await this._upload()
			},
			_startUpload: function() {
				clearTimeout(uploadTimeId)
				uploadTimeId = setTimeout(async function() {
					// 上传比赛数据
					await this._upload()
				}.bind(this), 30000)
			},
			_upload: async function() {
				var match = this.match.isModify ? this.match : null
				var section = this.section.isModify ? this.section : null
				var teams = this.teams.filter(team => team.isModify);
				var players = this.players.filter(player => player.isModify);
				if (!match && !section && teams.length === 0 && players.length === 0) return
				var body = {
					match,
					section,
					teams,
					players
				}
				var {
					data
				} = await http.post("/match/upload", body)
				if (match) match.isModify = false
				if (section) section.isModify = false
				teams.forEach(team => team.isModify = false)
				players.forEach(player => player.isModify = false)
				this._startUpload()
			}
			
		},
		filters: {
			...myFilter,
			foulFilter: function(team) {
				if (!team) return 0
				return team.foul || 0
			},
			pauseFilter: function(team) {
				if (!team) return 0
				return team.suspend || 0
			},
			statusFilter: function(status) {
				return myEnum.matchStatus[status || 0]
			},

		}
	}
</script>

<style lang="scss">
	.page {
		position: fixed;
		display: flex;
		flex-flow: column;
	}

	.match {
		display: flex;
		flex-flow: row nowrap;
		background-color: #007aff;
		color: #fff;
		border-top: 1upx solid #fff;
		border-top-color: rgba($color: #fff, $alpha: .5);
		border-bottom: 1upx solid #fff;
		border-bottom-color: rgba($color: #fff, $alpha: .5);

		.team {
			display: flex;
			flex-flow: column;
			align-items: center;
			width: 270upx;
			padding: 10upx 0;

			.title {
				font-weight: 800;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
				width: 100%;
			}

			.score {
				font-weight: 800;
				font-size: 1.3em;
			}

			.data {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-around;
				align-self: stretch;

				.data-item {
					display: flex;
					flex-flow: column;
					align-items: center;
					font-size: .8em;

					.data-title {
						padding: 5upx 20upx;
						border: 1px solid #fff;
						border-radius: 20upx;
					}
				}
			}
		}

		.match-info {
			padding: 10upx 0;
			flex-grow: 1;
			display: flex;
			flex-flow: column;
			align-items: center;

			.title {
				font-size: 1.1em;
				white-space: pre;
			}

			.time {
				font-size: 1.2em;
				font-weight: 800;
			}

			.match-operate {
				font-size: .8em;
				padding: 5upx 20upx;
				border-radius: 25upx;
				background-color: #e40641;
			}
		}

		.team:first-child {
			border-right: 1upx solid #fff;
			border-right-color: rgba($color: #fff, $alpha: .5);
		}

		.team:last-child {
			border-left: 1upx solid #fff;
			border-left-color: rgba($color: #fff, $alpha: .5);
		}
	}

	.teams {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		flex-grow: 1;

		.team {
			display: flex;
			flex-flow: column;
			width: 372upx;

			.caption {
				display: flex;
				flex-flow: row nowrap;
				background-color: #ff4948;
				color: #fff;
				padding: 5upx;

				.info {
					text-align: center;
				}
			}

			scroll-view {
				height: 700upx;
				flex-grow: 1;
			}

			.players {
				display: flex;
				flex-flow: column;
				flex-grow: 1;
				overflow: hidden;

				.player {
					align-items: stretch;
					display: flex;
					flex-flow: row nowrap;
					font-size: .9em;
					align-items: center;
					border-bottom: 1upx solid #ddd;
					height: 100upx;

					.data {
						font-size: .85em;
					}

					.name {
						font-size: .9em;
					}
				}
			}

			.data {
				flex-grow: 1;
				text-align: center;
				white-space: nowrap;
			}

			.info {
				width: 130upx;
				display: flex;
				flex-flow: column;
				overflow: hidden;
				white-space: nowrap;
				justify-content: center;

				.name {
					width: 100%;
					text-align: center;
				}
			}

			.number {
				width: 80upx;
				text-align: center;
			}

			.team-operate {
				border-top: 1upx solid #ddd;
				height: 65upx;
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-around;
				color: #fff;
				padding: 10upx;

				text {
					padding: 4upx 30upx;
					border-radius: 30upx;
					background-color: #007aff;
				}
			}

		}

		.foul {
			display: flex;
			flex-flow: row nowrap;
			height: 40upx;
			width: 100%;
			padding-left: 10upx;
			margin-top: 20upx;

			.foul-item {
				width: 16upx;
				height: 16upx;
				margin-right: 4upx;
				border-radius: 50%;
				background-color: #e40641;
			}
		}

		.team-left {
			border-right: 1upx solid #ddd;

			.caption {
				background-color: #31b0f5;

			}

			.foul-item {
				background-color: #31b0f5;
			}
		}

		.team-right {
			border-left: 1upx solid #ddd;
		}

	}


	.bottom-operate {
		width: 100%;
		background-color: #e40641;
		display: flex;
		flex-flow: row nowrap;
		padding: 10upx;
		height: 70upx;
		// align-items: stretch;
		color: #fff;

		text {
			text-align: center;
			padding: 6upx;
		}

		text:first-child {
			border-right: 1upx solid #fff;
			width: 354upx;
		}

		text:last-child {
			flex-grow: 1;
		}
	}

	.gray {
		background-color: gray !important;
	}

	.green {
		background-color: green !important;
	}

	.red {
		background-color: #e40641 !important;
	}
</style>
