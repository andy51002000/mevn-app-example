import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api().get('posts')
  },
  addPost (param) {
    return Api().post('posts', param)
  }
}
