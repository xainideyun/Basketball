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
				<text class="title">{{match.visitorName || '系统队'}}</text>
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
						<view class="player" :class="{selected: selectedPlayer.id === player.id}" v-for="(player, index) in upPlayers1"
						 :key="index" @tap="onPlayer(player)">
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
					<text @tap="onJoin()">增加球员</text>
					<text @tap="onReplace()">球员轮换</text>
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
						<view class="player" :class="{selected: selectedPlayer.id === player.id}" v-for="(player, index) in upPlayers2"
						 :key="index" @tap="onPlayer(player)">
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
			<text @tap="onToDetail()">比赛记录</text>
			<text @tap="onControl()">比赛操作</text>
		</view>


		<neil-modal :show="showWindow" @close="onHideWindow" :title="recordName" :showConfirm="false" :showCancel="false"
		 :show-cancel="false">
			<view class="data-list" style="margin-top: 10upx;">
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="篮板" :data-score="1" data-property="backboard">
					<text>篮板</text>
				</view>
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="助攻" :data-score="1" data-property="assists">
					<text>助攻</text>
				</view>
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="盖帽" :data-score="1" data-property="blockShot">
					<text>盖帽</text>
				</view>
			</view>
			<view class="data-list">
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="得分" :data-score="1" data-property="onePoint">
					<text>1分命中</text>
				</view>
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="得分" :data-score="2" data-property="twoPoint">
					<text>2分命中</text>
				</view>
				<view class="data-item" hover-class="data-item-hover" @tap="onRecord" data-tip="得分" :data-score="3" data-property="threePoint">
					<text>3分命中</text>
				</view>
			</view>
			<view class="data-list" style="margin-top: 10upx;">
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="罚球不中" :data-score="1"
				 data-property="unOnePoint">
					<text>1分不中</text>
				</view>
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="投篮不中" :data-score="1"
				 data-property="unTwoPoint">
					<text>2分不中</text>
				</view>
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="三分不中" :data-score="1"
				 data-property="unThreePoint">
					<text>3分不中</text>
				</view>
			</view>
			<view class="data-list" style="margin-bottom: 10upx;">
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="抢断" :data-score="1"
				 data-property="steals">
					<text>抢断</text>
				</view>
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="失误" :data-score="1"
				 data-property="fault">
					<text>失误</text>
				</view>
				<view class="data-item bg-warning" hover-class="bg-warning-hover" @tap="onRecord" data-tip="犯规" :data-score="1"
				 data-property="foul">
					<text>犯规</text>
				</view>
			</view>
		</neil-modal>
		
		<neil-modal :show="record.show" @close="onHideRecord()" title="比赛记录" :showConfirm="false" :showCancel="false"
		 :show-cancel="false">
			<scroll-view scroll-y="true" style="height: 800upx; overflow: hidden;" @scrolltolower="onLoadRecord()">
				<view class="log">
					<view class="item" v-for="(log, index) in record.list" :key="index">
						<view class="people">
							<text class="name">{{log.name}}</text>
							<text class="time">{{log.logTime.slice(11,16)}}</text>
						</view>
						<view class="body">
							<text>{{log.content}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</neil-modal>

	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	import myFilter from '@/utils/filters.js'
	import myEnum from '@/utils/enum.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import {
		dateUtils,
		jdcat,
		awaitWrap
	} from '@/utils/util.js'

	var uploadTimeId, matchTimeId
	export default {
		components: {
			neilModal
		},
		data() {
			return {
				match: {}, // 比赛对象
				section: {}, // 当前进行中的单节
				teams: [], // 队伍
				players: [], // 所有球员
				records: [], // 比赛记录
				record: { 	// 查看比赛记录
					list: [],
					pageSize: 15,
					show: false,
					hasData: true,
					maxScore: 100000000
				},
				
				buttons: [], // 操作菜单
				showWindow: false, // 是否显示数据记录窗口
				selectedPlayer: {} // 选中的球员
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
			data.sections
			var section = (data.sections || [])[data.sections.length - 1] || {}
			section.match = null
			section.isModify = false
			this.section = section // 设置正在进行中的单节

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
				if (status === 0) return 'gray'
				else if (status === 1) return 'green'
				else if (status === 2) return 'red'
				else return 'yellow'
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
			},
			recordName() {
				return this.selectedPlayer.name
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
			onToDetail: function() {
				// uni.navigateTo({
				// 	url: '/pages/home/match/detail?id=' + this.match.id
				// })
				this.record.show = true
				this.record.maxScore = 100000000
				this.record.HasData = true
				this.record.list = []
				this.onLoadRecord()
			},
			onLoadRecord: async function() {
				if (!this.record.hasData) return
				var self = this
				var {data} = await http.get(`/match/record/${this.match.id}?pageIndex=1&maxScore=${this.record.maxScore}&pageSize=${this.record.pageSize}`)
				if (data.length === 0) {
					this.HasData = false
					return
				}
				if (data.length < this.record.pageSize) {
					this.HasData = false
				}
				data.forEach(a => self.record.list.push(a))
				this.record.maxScore = data[data.length - 1].id - 1
			},
			onControl() {
				var team1 = this.teams[0],
					team2 = this.teams[1],
					self = this
				this.buttons = [{
					name: '更换统计员',
					method: 'onChange'
				}]
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
			onChange: function() {
				var team = this.teams[0]
				uni.navigateTo({
					url: `change?id=${team.id}&name=${team.name}`
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
				section.isModify = false
				this.section = section
				data.sections = null
				data.isModify = false
				this.match = data
				this.section.continueTime = now
				this.match.continueTime = now
				this.upPlayers1.forEach(a => a.continueTime = now)
				this.upPlayers2.forEach(a => a.continueTime = now)

				uni.hideLoading()
				uni.showToast({
					title: '比赛开始'
				})
				this._createLog('比赛开始', 15)
				this._start();
			},
			onPause(team) { // 比赛暂停
				this._createLog('比赛暂停', 17)
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
						this._createLog(`第${this.section.partNumber}节结束`, 18)
						await this._upload(true)
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
				} = await http.put("/match/next/" + this.section.id)
				var section = data.result
				section.isModify = false
				let now = Date.now()
				this.section = section
				this.match.continueTime = now
				this.match.status = 1
				this.upPlayers1.forEach(a => a.continueTime = now)
				this.upPlayers2.forEach(a => a.continueTime = now)
				this._createLog(`第${this.section.partNumber}节开始`, 15)
				this._start()

				uni.hideLoading()
				uni.showToast({
					title: '比赛开始',
				})

			},
			onBack() { // 返回上级页面
				uni.navigateBack()
			},
			onContinue: async function() { // 继续比赛
				uni.showLoading({
					title: '请稍等',
					mask: true
				})
				var now = Date.now()
				this.match.continueTime = now
				this.match.status = 1
				this.match.isModify = true
				this.section.continueTime = now
				this.section.isModify = true
				this.players
					.filter(a => a.status === 1)
					.forEach(a => a.continueTime = now)
				this._createLog(`比赛继续`, 19)
				await this._upload()
				this._start()

				uni.hideLoading()
				uni.showToast({
					title: '继续比赛',
				})
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
						self.match.endTime = dateUtils.time(),
							self.match.isModify = true
						self.section.status = 2
						self.section.isModify = true
						self._createLog(`比赛结束`, 16)
						await self._upload()
						uni.$emit("matchStatusChange", self.match)
						clearTimeout(uploadTimeId)
						uni.showToast({
							title: '比赛结束'
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/home'
							})
						}, 1000)
					}
				})
			},
			onPlayer(player) {
				if (this.match.status === 2) {
					jdcat.showError('比赛已结束')
					return
				}
				if (this.match.status === 4) {
					jdcat.showError('中场休息')
					return
				}
				if (this.match.status === 0) {
					jdcat.showError('比赛未开始')
					return
				}
				this.showWindow = true
				this.selectedPlayer = player
			},
			onRecord(e) {
				var prop = e.currentTarget.dataset,
					selectedPlayer = this.selectedPlayer,
					self = this,
					team = this.teams.find(team => team.id === self.selectedPlayer.teamId),
					section = this.section,
					match = this.match

				selectedPlayer[prop.property] += 1 // 记录球员数据
				team[prop.property] += 1 // 记录球队数据
				section[prop.property] += 1 // 记录单节数据
				if (prop.tip === "得分") {
					let score = +prop.score
					this.selectedPlayer.score += score // 记录球员总得分
					this.players.forEach(player => { // 记录上场球员正负值
						if (player.status === 0) return
						if (player.teamId === self.selectedPlayer.teamId) {
							player.getLost += score
						} else {
							player.getLost -= score
						}
						player.isModify = true
					})
					team.score += score // 记录球队得分

					if (match.hostName === team.name) { // 记录比赛得分
						match.hostScore += score
						section.hostScore += score
					} else {
						match.visitorScore += score
						section.visitorScore += score
					}
					match.isModify = true
				}

				selectedPlayer.isModify = true
				team.isModify = true
				section.isModify = true

				this._recordLog(prop)

				this._upload() // 上传数据
				this.onHideWindow()
			},
			onHideWindow() {
				this.showWindow = false
			},
			onHideRecord() {
				this.record.show = false
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
					})
					down.forEach(player => {
						var item = self.players.find(a => a.id === player.id);
						if (!item) return
						item.status = 0
						item.isModify = true
					})
					await self._upload()

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
					this.match.isModify = true
					this.section.takeupTime += 1000
					this.section.continueTime = now
					this.section.isModify = true
					this.players
						.filter(player => player.status === 1)
						.forEach(player => {
							player.takeupTime += 1000
							player.continueTime = now
							player.isModify = true
						})
				}.bind(this), 1000)
			},
			_pause: async function(team) {
				this.match.status = 3
				this.match.isModify = true
				if (team) {
					team.suspend++
					team.isModify = true
				}

				await this._upload()
				clearInterval(matchTimeId)

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
				var logs = this.records.length === 0 ? null : this.records
				if (!match && !section && teams.length === 0 && players.length === 0) return
				var body = {
					match,
					section,
					teams,
					players,
					logs
				}
				var {
					data
				} = await http.post("/match/upload", body)
				if (match) match.isModify = false
				if (section) section.isModify = false
				teams.forEach(team => team.isModify = false)
				players.forEach(player => player.isModify = false)
				this.records = []
				this._startUpload()
			},
			_createLog(content, category) {
				var user = this.$store.state.userinfo
				this.records.push({
					name: user.name || user.nickName,
					logTime: dateUtils.time(),
					content: content,
					category: category,
					matchId: this.match.id,
					userinfoId: user.id
				})
			},
			_recordLog(prop) {
				let content, tip = prop.tip,
					score = prop.score,
					name = prop.property
				if (name === 'onePoint') content = '罚球命中'
				else if (name === 'unOnePoint') content = '罚球不中'
				else if (name === 'twoPoint') content = '两分命中'
				else if (name === 'unTwoPoint') content = '两分不中'
				else if (name === 'threePoint') content = '三分命中'
				else if (name === 'unThreePoint') content = '三分不中'
				else if (name === 'foul') content = '失误 +1'
				else if (name === 'backboard') content = '篮板 +1'
				else if (name === 'blockShot') content = '盖帽 +1'
				else if (name === 'assists') content = '助攻 +1'
				else if (name === 'steals') content = '抢断 +1'
				else if (name === 'fault') content = '失误 +1'

				this._createLog(`${this.selectedPlayer.name} ${content}`)
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
					height: 150upx;

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

	.selected {
		background-color: #e0e0e0;
	}

	.data-list {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		border-left: 4upx solid transparent;
		border-right: 4upx solid transparent;
		margin-right: 10upx;
		margin-left: 10upx;

		.data-item {
			width: 166upx;
			height: 120upx;
			font-size: 1.1em;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 4upx solid #fff;
			border-right: 4upx solid #fff;
			background-color: #40adb4;
			color: #fff;
		}

		.data-item-hover {
			background-color: #10696f;
		}

		.bg-warning {
			background-color: #f6584c;
		}

		.bg-warning-hover {
			background-color: #902e27;
		}
	}
	
	.log {
		display: flex;
		flex-flow: column;
		align-items: stretch;
		padding-right: 20upx;
	
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
	
	.gray {
		background-color: gray !important;
	}

	.green {
		background-color: #4cdc4c !important;
	}

	.red {
		background-color: #e40641 !important;
	}

	.yellow {
		background-color: #ea7042 !important;
	}
</style>
