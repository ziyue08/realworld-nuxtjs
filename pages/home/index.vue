<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link class="nav-link" 
                 :class="{
                   active: tab === 'your_feed'
                 }"
                 exact
                :to="{
                  name: 'home',
                  query: {
                     tab: 'your_feed'
                  }
                }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                 <nuxt-link class="nav-link" 
                 :class="{
                   active: tab === 'global_feed'
                 }"
                 exact
                 :to="{
                  name: 'home',
                  query: {
                     tab: 'global_feed'
                  }
                }">Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link class="nav-link" 
                 :class="{
                   active: tab === 'tag'
                 }"
                 exact
                 :to="{
                  name: 'home',
                  query: {
                     tab: 'tag' ,
                     tag: tag ,
                  }
                }"># {{tag}}</nuxt-link>
              </li>  
            </ul>
          </div>

        <!-- 文章列表 -->
          <div 
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name:'profile',
                params: {
                    username: article.author.username
                }
              }">
                <img :src="article.author.username" />
              </nuxt-link>
              <div class="info">
                <nuxt-link  class="author" :to="{
                  name: 'profile',
                  params: { 
                    username: article.author.username
                  }
                }">{{article.author.username}}</nuxt-link>
                <span class="date">{{article.createdAt | date('MMM DD,YYYY')}}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
              :class="{active: article.favorited }" :disabled="article.favoriteDisabled" @click="onFavorite(article)">
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link 
             class="preview-link"
             :to="{
               name: 'article' ,
               params: {
                 slug: article.slug 
               }
             }"
             >
              <h1>{{ article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 文章列表 -->

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">              
              <li class="page-item " :class="{
                  active: item === page
                }"  
                v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link " :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }">{{item}}</nuxt-link>
              </li>             
            </ul>
          </nav>
          <!-- 分页列表 -->

        </div>

        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list" >
              <nuxt-link  class="tag-pill tag-default" 
              v-for="item in tags" :key="item"
              :to="{
                name: 'home',
                query: {
                  tag: item 
                }

              }"
              >{{item}}</nuxt-link>
            </div>
          </div>
        </div>
        <!-- 标签 -->
      </div>
    </div>

  </div>
</template>
<script>
import { getArticles, getYourFeedArticles ,deleteFavorite, addFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name:'home',
  async asyncData ({ query }) {
    const limit = 20 ;
    const page = Number.parseInt(query.page || 1) ;
    const tab = query.tab || 'global_feed' ;
    const tag = query.tag || '' ;
    const loadArticles = tab === 'global_feed' ? getArticles : getYourFeedArticles ;
    const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
        limit,
        offset: (page -1)*limit ,
        tag
      }) ,
      getTags()
    ]);

    const { articlesCount, articles } = articleRes.data ;
    const { tags } = tagRes.data ;
    articles.forEach(article => article.favoriteDisabled = false )
    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab
    }
  },
  watchQuery:['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']) ,
    totalPage () {
      return Math.ceil(this.articlesCount/this.limit);
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true 
      if (article.favorited) {
        //取消点赞
        await deleteFavorite(article.slug) ;
        article.favorited = false ; 
        article.favoritesCount += -1;
      } else {
        //添加点赞
        await addFavorite(article.slug) ;
        article.favorited = false ; 
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  }
}
</script>
<style scoped>

</style>