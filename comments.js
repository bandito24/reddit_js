const test = document.getElementById('test')
let replyItem = [];


const fetchComments = async () => {
    const data = await fetch("https://www.reddit.com/r/popular/comments/10wwoz1/how_do_multiple_programming_languages_make_one/.json");
    const results = await data.json();

    const postInfo = document.createElement('div')
    postInfo.classList.add('post-info');
    

    const subReddit = document.createElement('h4')
    subReddit.innerHTML = 'r/' + results[0].data.children[0].data.subreddit
    subReddit.classList.add('subreddit');

    const originURL = document.createElement('p')
    // originURL.innerHTML = results[0].data.children[0].data.permalink
    originURL.innerHTML = 'View Original Post'
    originURL.classList.add('origin-url');

    postInfo.append(subReddit, originURL)
    
    const post = document.createElement('div')
    post.classList.add('post')

    document.body.append(postInfo, post)

   
//    FOR CREATING THE TITLE AND ORIGINAL POST CONTENT

    
    const postAuthor = document.createElement('p')
    postAuthor.innerHTML = 'Originally posted by ' + results[0].data.children[0].data.author
    postAuthor.classList.add('post-author');
    
     //USE THIS  
    
    
    const title = document.createElement('h1');
    title.innerHTML = results[0].data.children[0].data.title;
    title.classList.add('title');

    const postText = document.createElement('p');
    postText.innerHTML = results[0].data.children[0].data.selftext
    postText.classList.add('post-text')

    const OPupvotes = document.createElement('p')
    OPupvotes.innerHTML = results[0].data.children[0].data.ups
    OPupvotes.classList.add('op-upvotes');

  
    post.append(postAuthor, title, postText, OPupvotes)

// FOR GENERATING THE REPLIES
    // const replyContainer = document.createElement('div')
    // replyContainer.classList.add('reply-container')
    // document.body.append(replyContainer)
    
    //this below (comments) is the array of primary comments, each with additional comments inside
    const comments = results[1].data.children
    comments.forEach(comment => {

        const replyContainer = document.createElement('div')
        replyContainer.classList.add('reply-container')
        document.body.append(replyContainer)
        
        const authorInput = document.createElement('p')
        authorInput.innerHTML = comment.data.author
        authorInput.classList.add('commentAuthor')
        replyContainer.append(authorInput)


        let reply = document.createElement('p')
        reply.innerHTML = comment.data.body
        reply.classList.add('first-reply')
        replyContainer.append(reply)
        
        const updoots = document.createElement('p')
        updoots.innerHTML = 'Upvotes: ' + comment.data.ups
        updoots.classList.add('upvotes')
        replyContainer.append(updoots)

        
        const firstReply = comment.data.replies
        

        function extractText(obj, author, ups, depth = 0) {
            for (const key in obj) {
              const item = obj[key];
              
              if (item && typeof item === 'object') {
                extractText(item, obj.author, obj.ups, depth + 1);
                
              } else if (key === 'body') {
                replyItem.push({depth: depth, author: obj.author, item: item, ups: obj.ups})
              }
              
          
            }
          }
          

          replyItem = [];
          extractText(firstReply)

          

          let orderedComments = []
          let thread = [];
          let location;
          let theShift;
          let mergedObj;
          let removedArrays;


          for(let i = 0; i < replyItem.length; i++){
              //THESE FIRST TWO CONDITIONALS ARE FOR ESTABLISHING THE CURRENT THREAD
              if(i === 0){
                  thread.push(replyItem[i])
              } 
              else if(replyItem[i]['depth'] < replyItem[(i - 1)]['depth']){
                  thread.unshift(replyItem[i])
              }

              //HANDLES THE CODE FOR WHEN THE NEXT VALUE IS NOT A COMMENT THREAD
              else if(replyItem[i]['depth'] >= replyItem[(i - 1)]['depth']){
                  if(thread.length > 0){
                      theShift = thread.shift()
                      if(thread.length > 0){
                          orderedComments[orderedComments.length] = (thread)
                      }

                      if(orderedComments.length == 1 && theShift['depth'] < orderedComments[0][0]['depth']){
                          location = -1
                      } 
                      else {
                      location = orderedComments.findLastIndex(obj => theShift['depth'] >= obj[0]['depth']) 
                      }
                          

                      if(location == -1){
                          orderedComments.unshift([theShift])
                          removedArrays = orderedComments.splice(0)
                          orderedComments[0] = removedArrays.reduce((acc, cur) => acc.concat(cur), []);
                      }
                      else{
                          if(location == (orderedComments.length - 1)){
                              orderedComments[(orderedComments.length)] = ([theShift])
                          }
                          else {    
                          orderedComments[location + 1].unshift(theShift)
                          removedArrays = orderedComments.splice(location + 1)
                          orderedComments[location + 1] = removedArrays.reduce((acc, cur) => acc.concat(cur), []);
                              
                          }
                      }
                  }
                      thread = [];
                      thread.push(replyItem[i])
              }


              //TO TEDIOUSLY HANDLE THE LAST VALUES OF THE LOOP WITH RECOPYING THE ABOVE CODE
              if(i == replyItem.length - 1){
            
                  if(thread.length > 0){
                      theShift = thread.shift()
                      if(thread.length > 0){
                          orderedComments[orderedComments.length] = (thread)
                      }

                      if(orderedComments.length == 1 && theShift['depth'] < orderedComments[0][0]['depth']){
                          location = -1
                      } 
                      else {
                      location = orderedComments.findLastIndex(obj => theShift['depth'] >= obj[0]['depth']) 
                      }
                          
                      if(location == -1){
                          orderedComments.unshift([theShift])
                          removedArrays = orderedComments.splice(0)
                          orderedComments[0] = removedArrays.reduce((acc, cur) => acc.concat(cur), []);
                      }
                      else{
                          if(location == (orderedComments.length - 1)){
                              orderedComments[(orderedComments.length)] = ([theShift])
                          } 
                          else { 
                          orderedComments[location + 1].unshift(theShift)
                          removedArrays = orderedComments.splice(location + 1)
                          orderedComments[location + 1] = removedArrays.reduce((acc, cur) => acc.concat(cur), []);   
                          }
                      }
      
                 }  


              

              }            
          }
                
          
           //used for single outlier, would probably be better with a while loop that says if it's increasing but doesn't equal five to search for the next value that equals +5 and just drop it in rather than swithing it
           orderedComments.forEach(arr => {
            for (let i = 0; i < arr.length - 1; i++){
                if(arr[i]['depth'] < arr[i+1]['depth'] && (arr[i]['depth'] != arr[i+1]['depth'] - 5)){
                    temp = arr[i + 1];
                    arr[i + 1] = arr[i + 2]
                    arr[i + 2] = temp
                }
                
            }
        })




          orderedComments.forEach(arr => {

            const commentChain = document.createElement('div');
            replyContainer.append(commentChain)
    

            for(let i = 0; i< arr.length; i++){
              const threadExtension = document.createElement('div');
              const author = document.createElement('p')
              author.innerHTML = arr[i]['author']
              author.classList.add('commentAuthor')
              threadExtension.append(author)
              
              const threadResponse = document.createElement('p')

              // threadResponse.innerHTML = arr[i]['item'] + '</br>' + 'depth: ' + arr[i]['depth']
              threadResponse.innerHTML = arr[i]['item']
              threadExtension.classList.add('thread-extension')
              commentChain.append(threadExtension)
              threadExtension.append(threadResponse)
              // threadExtension.setAttribute('data-indent', arr[i]['depth'])
              
              const upvotes = document.createElement('p')
              upvotes.innerHTML = 'Upvotes: ' + arr[i]['ups']
              upvotes.classList.add('upvotes')
              
              threadExtension.append(upvotes)

              threadExtension.style.left = arr[i]['depth'] * 20 + 'px'
              
              

            }


          })
                      
            
          console.log(orderedComments)
              })
              
}

fetchComments()

