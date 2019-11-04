<template>
	<view style="overflow-x: hidden;">
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-face">
						<view class="avator">
							<img :src='isRegisted ? userinfo.faceUrl : "../../static/nologin.png"'>
						</view>
					</view>
					<view class="box-name">
						<view class="phone-name" v-if="isRegisted">{{userinfo.nickName}}</view>
						<view class="login" v-else>
							<button type="primary" lang="zh_CN" size="mini" open-type="getUserInfo" plain="true" @getuserinfo="getUserInfo">授权登录</button>
						</view>
					</view>
					<view class="box-bd">
						<navigator class="item" url="/pages/my/enroll">
							<view class="icon"><img src="../../static/message.png"></view>
							<view class="text">报名活动</view>
						</navigator>
						<view class="item">
							<view class="icon"><img src="../../static/favorite.png"></view>
							<view class="text">比赛统计</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content" style="margin-top: 50px;">
			<view class="list" @tap="toEditSelf">
				<view class="li noborder">
					<view class="icon">
						<image src="../../static/card.png"></image>
					</view>
					<view class="text">我的名片</view>
					<text class="jdcat jdcat-right"></text>
				</view>
			</view>
			<view class="list">
				<view class="li ">
					<view class="icon">
						<image src="../../static/about.png"></image>
					</view>
					<view class="text">关于我们</view>
					<text class="jdcat jdcat-right"></text>
				</view>
				<view class="li ">
					<view class="icon">
						<image src="../../static/feedback.png"></image>
					</view>
					<view class="text">意见反馈</view>
					<text class="jdcat jdcat-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		data() {
			return {
				// userinfo: {},
				// isRegisted: false
			};
		},
		computed: mapState({
			userinfo: 'userinfo',
			isRegisted: state => state.userinfo.isRegisted,

		}),
		onLoad() {
			
		},
		methods: {
			getUserInfo: async function(e) {
				if (e.detail.errMsg !== "getUserInfo:ok") return;
				let detail = e.detail.userInfo
				let user = { ...this.userinfo,
					...{
						nickName: detail.nickName,
						faceUrl: detail.avatarUrl,
						city: detail.city,
						country: detail.country,
						gender: detail.gender,
						language: detail.language,
						province: detail.province
					}
				}
				var {data} = await http.post('/user', user)
				
				data.result.isRegisted = true
				this.$store.commit('setUserInfo', data.result)

				uni.showToast({
					title: '登录成功'
				})
			},
			toEditSelf: function(){
				if (!this.userinfo.isRegisted) {
					uni.showToast({
						title: '请先登录系统', icon: 'none'
					});
					return
				}
				uni.navigateTo({
					url: '/pages/my/editself'
				});
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
		font-size: 30upx;
		position: fixed;
	}

	.header {
		background: #007aff;
		height: 290upx;
		padding-bottom: 110upx;

		.bg {
			width: 100%;
			height: 200upx;
			padding-top: 100upx;
			background-color: #007aff;
		}
	}

	.box {
		width: 650upx;
		height: 350upx;
		border-radius: 20upx;
		margin: 0 auto;
		background: #fff;
		box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, .2);

		.box-face {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;

			.avator {
				width: 160upx;
				height: 160upx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 50%;
				margin-top: -80upx;
				overflow: hidden;
				align-items: center;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}

		.box-hd {
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
			justify-content: center;
			align-content: center;

		}

		.phone-name {
			width: 100%;
			text-align: center;
		}

		.login {
			text-align: center;

			button[type=primary] {
				color: #007AFF;
				border: 1px solid #007AFF;
			}
		}

		.box-bd {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;

			.item {
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #f1f1f1;
				margin: 15upx 0;

				&:last-child {
					border: none;
				}

				.icon {
					width: 60upx;
					height: 60upx;

					img {
						width: 100%;
						height: 100%;
						text-align: center;
					}
				}

				.text {
					width: 100%;
					text-align: center;
					margin-top: 10upx;
				}
			}
		}
	}

	.list-content {
		background: #fff;
	}

	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}

		.li {
			width: 97%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx;
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666;
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}

			.jdcat-right {
				margin-right: 20upx;
			}

		}
	}
</style>
