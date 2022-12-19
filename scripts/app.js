Vue.createApp({
  data() {
      return {
        // errors
        errorShow: false,
        error: "",

        // switch pages
        currentPage: 'Main',

        // slider
        sliderImgArray: [
          'SLIDE1.PNG',
          'SLIDE2.PNG',
          'SLIDE3.PNG',
          'SLIDE4.PNG',
          'SLIDE5.PNG',
        ],
        currentSlide: 0,

        //products
        productsArray: [
          { name: 'Death Stranding',    img: 'PRODUCT1.PNG', category: "Game-film", price: 99, inf: "THE BEST GAME", quantity: 1, quantityInShop: 20},
          { name: 'Metal Gear Solid V', img: 'PRODUCT2.PNG', category: "Shooter",   price: 89, inf: "THE BEST GAME", quantity: 1, quantityInShop: 20},
          { name: 'Metal Gear Rising',  img: 'PRODUCT3.PNG', category: "Shooter",   price: 79, inf: "THE BEST GAME", quantity: 1, quantityInShop: 20},
          { name: 'Silent Hill',        img: 'PRODUCT4.PNG', category: "Horor",     price: 69, inf: "THE BEST GAME", quantity: 1, quantityInShop: 20},
        ],
        currentProduct: [],
        
          // filters
        filtersArray: [
          'name', 'price'
        ],
        currentFilter: '',

        categoriesArray: [
          'Game-film', 'Shooter', 'Horor'
        ],
        currentCategory: '',
        
        // login and reg
        ifWrongEmailOrPassword: "",
        ifWrongRegistration: "",
        usersArray: [
          {userName: 'admin', userEmail: 'admin@gmail.com', userPassword: 'admin', userRole: 'admin'},
        ],
        currentUser: '',

          // login
        formLogin: {
          userEmail: '',
          userPassword: '',
        },

          // reg
        formReg: {
          userName: '',
          userPhone: '',
          userEmail: '',
          userPassword: '',
          userRePassword: '',
          userCheck: false,
        },

        // cart
        cartItemsArray: [],
    }
  },

  methods: {
    // products
    showProductAbout(el) {
      this.currentPage = "productAbout"
      this.currentProduct.push(el)
    },

    // cart
    addToCart(el) {
      if (this.currentUser) {
        const exist = this.cartItemsArray.find(element => element.name == el.name)
        if (exist) {
          if (exist.quantity + el.quantity >= exist.quantityInShop) {
            exist.quantity = exist.quantityInShop
            console.log(this.cartItemsArray)
          }
          else {
            exist.quantity += el.quantity
          }
        }
        else {
          this.cartItemsArray.push({...el})
          console.log(this.cartItemsArray)
        }
      }
      else {
        this.errorShow = true
        this.error = "To add item to cart u gotta login into account"
      }
    },

    // slider
    next() {
      this.currentSlide + 1 > this.sliderImgArray.length -1 ? this.currentSlide = 0 : this.currentSlide++;
    },

    // login and reg
    login() {
      if (this.formLogin.userEmail && this.formLogin.userPassword) {
        const user = this.usersArray.find(el => el.userEmail === this.formLogin.userEmail && el.userPassword === this.formLogin.userPassword)
        if(user) {
          this.currentUser = user
          this.currentPage = 'Main'
          this.formLogin.userEmail = ''
          this.formLogin.userPassword = ''
          this.ifWrongEmailOrPassword = ''
          localStorage.setItem('user', JSON.stringify(this.currentUser))
        }
        else {
          this.formLogin.userPassword = ''
          this.ifWrongEmailOrPassword = "Password or email is wrong"
        }
      }
    },

    reg() {
      if (this.formReg.userPassword == this.formReg.userRePassword) {
        if (this.formReg.userCheck) {
          const emailCheck = this.usersArray.find(el => el.email == this.formReg.userEmail)
          if (emailCheck) {
            console.log("Такая почта существует")
            this.ifWrongRegistration = 'This email is already exist in system'
          }
          else {
            const user = {...this.formReg}
            delete user.userPhone
            delete user.userRePassword
            delete user.userCheck
            user.userRole = 'user'
            this.usersArray.push(user)
            this.currentUser = user
            this.formReg.userName = ""
            this.formReg.userNumber = ""
            this.formReg.userEmail = ""
            this.formReg.userPassword = ""
            this.formReg.userRePassword = ""
            this.formReg.userConfirm = false
            this.currentPage = "Main"
            localStorage.setItem('user', JSON.stringify(this.currentUser))
          }
        }
      }
      else {
        this.ifWrongRegistration = 'Please, make sure you have confirmed your password correctly.'
      }
    },

    exit() {
      this.currentUser = '',
      this.currentPage = 'Main',
      localStorage.clear()
    }
  },

  computed: {
    // slider
    tSlide() {
      return `transform: translate(-${this.currentSlide * 100}%)`
    }, 

    // filters 
    copyProductsArray() {
      let copy = [...this.productsArray]
      if (this.currentFilter) {
        copy.sort((a, b) => {
          if (a[this.currentFilter] > b[this.currentFilter]) {
            return 1
          }
          if (a[this.currentFilter] == b[this.currentFilter]) {
            return 0
          }
          if (a[this.currentFilter] < b[this.currentFilter]) {
            return -1
          }
        })
      }
      if(this.currentCategory) {
        return copy.filter( el => el.category == this.currentCategory)
      }
      return copy
    },

    // login and reg
    isAuth() {
      return this.currentUser
    },

    isAdmin() {
      return this.currentUser && this.currentUser.role == 'admin'
    }
  },

  mounted() {
    // slider
    setInterval( () => {
      this.next()
    }, 1500)

    // login
    const user = localStorage.getItem('user')
    user ? this.currentUser = JSON.parse(user) : ''
  }

}).mount('#app')