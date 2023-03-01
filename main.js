const axios = require('axios')
const {TwitterClient} = require('twitter-api-client')

exports.handler = async (event) => {
    
    const res = await axios.get("Linkto");
    const res_drop = await axios.get("Linkto");
    const res_top_gainers = await axios.get("Linkto");
    const private_eye = await axios.get("Linkto");
    const hiddenGems = await axios.get("Linkto");
    
    
    let resList = Object.keys(res.data).map((coll) => {
        return {
            address: coll,
            ...res.data[coll],
          };
    });
    
    let top_gainers_list = Object.keys(res_top_gainers.data).map((coll) => {
        return {
            address: coll,
            ...res_top_gainers.data[coll],
          };
    });
    
    let new_drops_List = Object.keys(res_drop.data).map((coll) => {
    return {
        address: coll,
        ...res_drop.data[coll],
      };

    });
    
    let res_record_private_eye = Object.keys(private_eye.data).map((coll) => {
    return {
        address: coll,
        ...private_eye.data[coll],
      };

    });
    
    let res_hiddenGems = Object.keys(hiddenGems.data).map((coll) => {
        return {
            address: coll,
            ...hiddenGems.data[coll],
          };
    
    });
    
    
    let topTrandingPerforming = resList;
    let newres = resList.slice(0,5);
  
    topTrandingPerforming.sort( function (a,b) {
    return (b.volume_7d_change * 100) - (a.volume_7d_change * 100 )
    })
    
    
    let trading_collection =  [];

    
    for (let i = 0; i < 5; i++) {
        // let res = newres[i].collection_name.replace(/\s/g '');
       let res = newres[i].collection_name;

        trading_collection.push(res)
    };
    
    let trading_collection_performing = [];

    for (let i = 0; i < 5; i++) {
        let res2 = topTrandingPerforming[i].collection_name.replace(/\s/g, '');
        // let res2 = topTrandingPerforming[i].collection_name

        trading_collection_performing.push(res2 + " (+" +(topTrandingPerforming[i].volume_7d_change * 100).toFixed(2) + "%) ")
    };
    
    
    let trading_drops_list =  []
    let drops_list = new_drops_List.slice(0,5);

    for (let i = 0; i < 5; i++) {
        let res = drops_list[i].collection_name.replace(/\s/g, '');
        trading_drops_list.push(res)
    };
    
    let slice_top_gainers_list = top_gainers_list.slice(0,5);
    
    
    let gainers_list = [];
    for (let i = 0; i < 5; i++) {
        let res = slice_top_gainers_list[i].collection_name.replace(/\s/g, '');
        gainers_list.push(res + " ")
    }
    
    let hiddenGem_collection =  []

    res_hiddenGems = res_hiddenGems.map((collection)=> {
        if(res_record_private_eye[0][collection.address]) {
            return {
                ...collection,
                "whales": Object.keys(res_record_private_eye[0][collection.address]).length
            }
        }
        return {
            ...collection,
            "whales": 0
        }
    })
    
    res_hiddenGems.sort((a, b) => {
        return b.whales - a.whales
    })
    
    let filtered_hidden_gems = res_hiddenGems.filter((collection) => {
        if(collection.floor > 0) return collection
    });
    
    for (let i = 0; i < 5; i++) {

    let res = filtered_hidden_gems[i].collection_name.replace(/\s/g, '');
    hiddenGem_collection.push(res)
    }
    let hidden_gem_performing = filtered_hidden_gems;
    
    let hidden_gem_list_performing = [];
    
    hidden_gem_performing.sort(function (a,b) {
      return b.volume_7d_change * 100 - a.volume_7d_change * 100 
    });
    
    for (let i = 0; i < 5; i++) {
        let res = hidden_gem_performing[i].collection_name.replace(/\s/g, '');
        hidden_gem_list_performing.push(res + " (+" +(hidden_gem_performing[i].volume_7d_change * 100).toFixed(2) + "% )")
    }
    
    
    var tw = new TwitterClient({
          accessToken:process.env.ACCESS_TOKEN,
          accessTokenSecret:process.env.ACCESS_TOKEN_SECRET,
          apiKey: process.env.API_KEY,
          apiSecret:process.env.API_SECRET
    })
    
    
   
    
    
    var text_trending = "Top 5  " + "#"+trading_collection.join(" #") + 
    ". For more analytics" ;
    
    var text_trending_performing = "Top 5 performing " + "#"+trading_collection_performing.join(" #") + 
    "." ;
    
     var trading_drops = "Top 5 trending " + "#"+trading_drops_list.join(" #") + 
    "." ;
    
     var trading_gainers = "Top 5 Gainer " + "#"+gainers_list.join(" #") + 
    "." ;
    
      var trading_hidden_gem = "Top 5 performing Hidden " + "#"+hidden_gem_list_performing.join(" #") + 
    "." ;
    
    
    
    
    const promise = tw.tweets.statusesUpdate({
        status: text_trending
    }).then (response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
    
    // return promise
    
    
    const send_text_trending_performing = tw.tweets.statusesUpdate({
        status: text_trending_performing
    }).then (response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
    
    // return send_text_trending_performing
    
    const send_trading_drops = tw.tweets.statusesUpdate({
        status: trading_drops
    }).then (response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
    
    // return send_trading_drops
    
    const send_trading_gainers = tw.tweets.statusesUpdate({
        status: trading_gainers
    }).then (response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
    
    // return send_trading_gainers
    
    const send_trading_hidden_gem = tw.tweets.statusesUpdate({
        status: trading_hidden_gem
    }).then (response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
    
    return send_trading_hidden_gem, send_trading_gainers, send_trading_drops, send_text_trending_performing, promise

};
