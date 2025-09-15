import user from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const getRecommendedUsers = await user.find({
        $and: [
            { _id: { $ne: currentUserId } },
            { _id: { $nin: currentUser.friends } },
            {isOnboarded: true}
        ]
    })
    res.status(200).json(getRecommendedUsers);
  } catch (error) {
    console.error("error in getting recommened users",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const currentUser = await user.findById(req.user.id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLang learningLang ");
    res.status(200).json(currentUser.friends);
  } catch (error) {
    console.error("error in getting my friends",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try { 
    const myId = req.user.id;
    const {id:recipientId} = req.params;

    //prevent sending request to oneself
    if(myId === recipientId){
        return res.status(400).json({ message: "Bad Request cannot send request to oneself" });
    }
    
    //check if recipient exists
    const recipient = await user.findById(recipientId);
    if(!recipient){
        return res.status(404).json({ message: "Recipient user not found" });
    }   
    //check if already friends
    if(recipient.friends.includes(myId)){
        return res.status(400).json({ message: "You're already friends" });
    }
    
    //check if a pending request already exists
    const existingRequest = await FriendRequest.findOne({
        $or: [{sender: myId,
        recipient: recipientId},
        {sender: recipientId,
        recipient: myId}
        ]
    });
    if(existingRequest){
        return res.status(409).json({ message: "Friend request already sent by you or the user" });
    }

    //create new friend request
    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("error in sending friend request",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try { 
    const myId = req.user.id;
    const {id:requestId} = req.params;

    //find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if(!friendRequest){
        return res.status(404).json({ message: "Friend request not found" });
    }
    //check if the request is meant for the logged in user
    if(friendRequest.recipient.toString() !== myId){
        return res.status(403).json({ message: "Forbidden you cannot accept this request" });
    }
    //check if already accepted
    if(friendRequest.status === "accepted"){
        return res.status(400).json({ message: "Bad Request already accepted" });
    }

    //update the status of the friend request to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each other to friends list
    await user.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient }
    });
    await user.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender }
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("error in accepting friend request",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try{
    const incomingRequests = await FriendRequest.find({
        recipient: req.user.id,
        status: "pending"
    }).populate("sender", "fullName profilePic nativeLang learningLang ");

    const acceptedRequests = await FriendRequest.find({
        sender: req.user.id,
        status: "accepted"
    }).populate("recipient", "fullName profilePic nativeLang learningLang");
    res.status(200).json({ incomingReqs: incomingRequests, acceptedReqs: acceptedRequests });
  } catch (error) {
    console.error("error in getting friend requests",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try{
    const outgoingRequests = await FriendRequest.find({
        sender: req.user.id,
        status: "pending"
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage ");
    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("error in getting outgoing friend requests",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function rejectFriendRequest(req, res) {
  try { 
    const myId = req.user.id;
    const {id:requestId} = req.params;

    //find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if(!friendRequest){
        return res.status(404).json({ message: "Friend request not found" });
    }
    //check if the request is meant for the logged in user
    if(friendRequest.recipient.toString() !== myId){
        return res.status(403).json({ message: "Forbidden you cannot reject this request" });
    }
    //check if already accepted
    if(friendRequest.status === "accepted"){
        return res.status(400).json({ message: "Bad Request already accepted" });
    }

    //update the status of the friend request to rejected
    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("error in rejecting friend request",error.message);
    res.status(500).json({ message: "Server Error" });
  }
}