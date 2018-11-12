import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index'

import Main from '../components/Main'
import NewSong from '../components/new_song/NewSong'
import RankList from '../components/rank/RankList'
import SongList from '../components/song/SongList'
import SingerCategory from '../components/singer/SingerCategory'
import RankInfo from '../components/rank/RankInfo'
import SongListInfo from '../components/song/SongListInfo'
import SingerList from '../components/singer/SingerList'
import SingerInfo from '../components/singer/SingerInfo'
import Search from '../components/search/Search'
import PlayerMax from '../components/player/PlayerMax'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '/',
          component: NewSong
        },
        {
          path: '/rank/list',
          component: RankList
        },
        {
          path: '/song/list',
          component: SongList
        },
        {
          path: '/singer/category',
          component: SingerCategory
        }
      ]
    },
    {
      path: '/rank/info/:id',
      component: RankInfo
    },
    {
      path: '/song/list/:id',
      component: SongListInfo
    },
    {
      path: '/singer/list/:id',
      component: SingerList
    },
    {
      path: '/singer/info/:id',
      component: SingerInfo
    },
    {
      path: '/search/index',
      component: Search
    },
    {
      path: '/player/max',
      component: PlayerMax,
      name: 'PlayerMax'
    }
  ]
})

//todo these data should be loaded after current page data loaded. They won't request again unless user refresh pages.
let staticLikePagesPath = router.options.routes[0].children.map(
  child => child.path
)
router.staticLikePagesPath = [...staticLikePagesPath]

router.beforeEach((to, from, next) => {
  //play music if musicHash exist
  let musicHash = to.query.musicHash
  if (musicHash && !to.params.fromPlayerMed) {
    store.commit('player/wantPlay', { musicHash })
  }
  let noLoadingPagesPath = [
    ...router.staticLikePagesPath,
    '/search/index',
    '/player/max'
  ]
  let isFromSingerInfoToList =
    from.path.startsWith('/singer/info/') && to.path.startsWith('/singer/list/')
  if (!noLoadingPagesPath.includes(to.path) && !isFromSingerInfoToList) {
    store.commit('replaceProperty', { paths: 'loading.isShow', data: true })
  }
  next()
})

export default router
