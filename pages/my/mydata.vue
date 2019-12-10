<template>
	<view>
		<view class="list-item" v-for="(item, index) in list" :key='index' @tap="toDetail(item)">
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
		<view class="empty" v-if="list.length > 0">
			<text>没有参与过任何活动。</text>
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
				hasData: true
			}
		},
		onLoad: async function() {
			console.log(this.$store.state);
			var {data} = await http.get('/user/match/' + this.$store.state.userinfo.id)
			console.log(data);
		}
	}
</script>

<style>
</style>
