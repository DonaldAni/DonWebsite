class Author {
    constructor(icon, displayname, color) {
        this.icon = icon
        this.displayname = displayname
        this.color = color
    }
}
class BlogData {
    constructor(title, date, icon, author, previewtext, path) {
        this.title = title
        this.date = date
        this.icon = `img/icons/${icon}`
        this.author = author
        this.previewtext = previewtext
        this.path = `posts/${path}`
    }

    getAuthorIconPath() {
        return `img/authors/${this.author.icon}`
    }
}

const AUTHOR_DATA = {}
const POSTS = {}

function makeblog(blogdata) {
    let blogpreview = document.createElement("div")
        blogpreview.className = "blogpreview"
    
        let blogauthordetails = document.createElement("div")
            blogauthordetails.className = "blogauthordetails"

            let authoricon = document.createElement("img")
                authoricon.className = "authoricon"
                authoricon.src = blogdata.getAuthorIconPath()

            let authorname = document.createElement("p")
                authorname.className = "authorname"
                console.log(blogdata.author.color)
                authorname.style.color = blogdata.author.color
                authorname.innerText = blogdata.author.displayname

        blogauthordetails.append(authoricon, authorname)

        let blogpreviewbody = document.createElement("div")
            blogpreviewbody.className = "blogpreviewbody"

            let blogpreviewtopdetails = document.createElement("div")
                blogpreviewtopdetails.className = "blogpreviewtopdetails"

                let blogicon = document.createElement("img")
                    blogicon.className = "blogicon"
                    blogicon.src = blogdata.icon

                let blogtitle = document.createElement("h1")
                    blogtitle.className = "blogtitle"
                    blogtitle.innerText = blogdata.title

                let blogdate = document.createElement("p")
                    blogdate.className = "blogdate"
                    blogdate.innerText = blogdata.date
            
            blogpreviewtopdetails.append(blogicon, blogtitle, blogdate)

            let blogpreviewcontent = document.createElement("div")
                blogpreviewcontent.className = "blogpreviewcontent"

                let blogpreviewtext = document.createElement("p")
                    blogpreviewtext.innerText = blogdata.previewtext

                let blogpreviewreadmore = document.createElement("a")
                    blogpreviewreadmore.className = "blogpreviewreadmore"
                    blogpreviewreadmore.href = blogdata.path

                    let blogpreviewreadmoretext = document.createElement("p")
                        blogpreviewreadmoretext.innerText = "Read More >>"

                blogpreviewreadmore.append(blogpreviewreadmoretext)
            blogpreviewcontent.append(blogpreviewtext, blogpreviewreadmore)
        blogpreviewbody.append(blogpreviewtopdetails, blogpreviewcontent)
    blogpreview.append(blogauthordetails, blogpreviewbody)

    return blogpreview
}

const BLOGS = document.getElementById("blogs")

async function loadposts() {
    const res = await fetch("data/authors.json")
    const data = await res.json()

    for(const author of Object.keys(data)) {
        AUTHOR_DATA[author] = new Author(data[author].icon, data[author].displayname, data[author].color)
    }

    const postres = await fetch("data/posts.json")
    const postdata = await postres.json()

    for(const post of postdata) {
        console.log(post)
        let blogpost = new BlogData(post.title, post.date, post.icon, AUTHOR_DATA[post.author], post.previewtext, post.path)
        let blogpreview = makeblog(blogpost)
        BLOGS.append(blogpreview)
    }
}
loadposts()