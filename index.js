//for checking if there's media or self text to send over to comments via query
let mediaType;
let selfText

const columnContainer = document.getElementById('column-container')



const getResults = async() => {
    const data = await fetch('https://www.reddit.com/r/popular.json')
    const jsonData = await data.json()
    const posts = jsonData.data.children
   
    
    posts.forEach(post => {
        let content = post.data
        let newDiv = document.createElement('div')
        newDiv.classList.add('post-window')

        newDiv.classList.add('post-window');
        document.body.appendChild(newDiv)

        const headerDiv = document.createElement('div')
        headerDiv.classList.add('header-div')
        newDiv.append(headerDiv)


     //FOR SUBREDDIT NAME
    

        const subReddit = document.createElement('h4')
        subReddit.classList.add('subreddit')
        subReddit.innerHTML = content.subreddit

        headerDiv.appendChild(subReddit)



    // FOR THUMBNAILS

        if(content.thumbnail != 'self' && content.thumbnail != "" && content.thumbnail != "nsfw" && content.thumbnail != "default" && content.thumbnail != "image"){
            const thumbNail = document.createElement('img')
            thumbNail.classList.add('thumbnail')
            thumbNail.src = content.thumbnail
            headerDiv.appendChild(thumbNail)

            
        } else if(content.thumbnail == 'nsfw') {
            const thumbNail = document.createElement('img')
            thumbNail.classList.add('thumbnail')
            thumbNail.src = './nsfw.jpeg'
            headerDiv.appendChild(thumbNail) 
           
        }
    
    
    //FOR TITLE AND CREATING THE ANCHOR TAG
        let name = content.name
        name = name.split('_')[1]

        let title = content.title.split('').filter(char => !/\p{P}/gu.test(char)).join('')
        title = title.replaceAll(' ', '_')
    

        let header = document.createElement('h3')
        header.classList.add('header')
        header.innerHTML = content.title

        const headerAnchor = document.createElement('a');
        headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}"`
        
        headerAnchor.appendChild(header)
        newDiv.appendChild(headerAnchor)
        
    
    //FOR URL
        if(content.url && content.link_flair_type == 'text'){
        let url = document.createElement('p')
        url.innerHTML = content.url
        url.classList.add('url')
        newDiv.append(url)
        }
    //FOR IMAGES AND VIDEO

      
        if(content.secure_media_embed && content.secure_media_embed.media_domain_url){
            let videoContent = document.createElement('iframe')
            videoContent.src = content.secure_media_embed.media_domain_url
           videoContent.classList.add('movies')
            newDiv.appendChild(videoContent)
            mediaType = 'yt'
            headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&yt=${content.secure_media_embed.media_domain_url}`
       
            

        } else if(content.media && content.media.reddit_video && content.media.reddit_video.fallback_url){
            let videoContent = document.createElement('video')
            videoContent.src = content.media.reddit_video.fallback_url
            videoContent.controls = true;
            videoContent.classList.add('movies')
            newDiv.appendChild(videoContent)
            mediaType = 'mov'
            headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&mov=${content.media.reddit_video.fallback_url}`
          

        } else if(content.crosspost_parent_list && content.crosspost_parent_list[0].secure_media && content.crosspost_parent_list[0].secure_media.reddit_video && content.crosspost_parent_list[0].secure_media.reddit_video.fallback_url){
            let videoContent = document.createElement('video')
            videoContent.src = content.crosspost_parent_list[0].secure_media.reddit_video.fallback_url
            videoContent.controls = true;
            videoContent.classList.add('movies')
            newDiv.appendChild(videoContent)
            mediaType = 'mov'
            headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&mov=${content.crosspost_parent_list[0].secure_media.reddit_video.fallback_url}`

        } else if(content.preview && content.preview.reddit_video_preview && content.preview.reddit_video_preview.fallback_url){
            let videoContent = document.createElement('video')
            videoContent.src = content.preview.reddit_video_preview.fallback_url
            videoContent.controls = true;
            videoContent.classList.add('movies')
            newDiv.appendChild(videoContent)
            mediaType = 'mov'
            headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&mov=${content.preview.reddit_video_preview.fallback_url}`
        
        } else if(content.is_reddit_media_domain == true){
            let image = document.createElement('img')
            image.src = content.url_overridden_by_dest
            image.classList.add('image')
            newDiv.appendChild(image)
            mediaType = 'img'
            headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&img=${content.url_overridden_by_dest}`
        } 

    //FOR GETTING TEXT IN THE ELEMENT
    if(content.selftext){
        selfText = true
        let text = document.createElement('p')
        text.textContent = content.selftext
        // console.log(text)
        const textDiv = document.createElement('div')
        textDiv.classList.add('text-div')
        newDiv.append(textDiv)
        text.classList.add('text')
        textDiv.append(text)
        // headerAnchor.href = `./comments.html?sub=${content.subreddit}&id=${name}&title=${title}&text=${text}"`
        
}


mediaType = null
selfText = null
    })
   
const headerClass = document.getElementsByClassName('header');
[...headerClass].forEach(header => {
    header.addEventListener('click', function() {
        console.log(this.dataset.info)
    })
})

}


getResults()




