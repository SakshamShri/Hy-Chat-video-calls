import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, Plus, UserMinus, MessageCircle, Settings, Trash2 } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUserGroups, createGroup, deleteGroup, addMemberToGroup, removeMemberFromGroup, getUserFriends } from "../lib/api";

const GroupsPage = () => {
  const { authUser } = useAuthUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch user's groups
  const { data: userGroups = [], isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['groups'],
    queryFn: getUserGroups,
    enabled: !!authUser
  });

  // Fetch user's friends for member selection
  const { data: allFriends = [], isLoading: friendsLoading, error: friendsError } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    enabled: !!authUser
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      toast.success("Group created successfully!");
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create group");
    }
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      toast.success("Group deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete group");
    }
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: ({ groupId, memberId }) => addMemberToGroup(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      toast.success("Member added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to add member");
    }
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, memberId }) => removeMemberFromGroup(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      toast.success("Member removed successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to remove member");
    }
  });

  // Create group handler
  const handleCreateGroup = (groupData) => {
    createGroupMutation.mutate(groupData);
  };

  // Delete group handler
  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate(groupId);
  };

  // Add member handler
  const handleAddMember = (groupId, memberId) => {
    addMemberMutation.mutate({ groupId, memberId });
  };

  // Remove member handler
  const handleRemoveMember = (groupId, memberId) => {
    removeMemberMutation.mutate({ groupId, memberId });
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Groups</h1>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">Manage your group conversations</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
        >
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Create Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      {groupsLoading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : groupsError ? (
        <div className="text-center py-12">
          <div className="alert alert-error max-w-md mx-auto">
            <span>Failed to load groups. Please try again.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {userGroups.map((group) => (
              <GroupCard 
                key={group._id}
                group={group}
                onManageMembers={() => {
                  setSelectedGroup(group);
                  setShowMembersModal(true);
                }}
                onDeleteGroup={handleDeleteGroup}
                isAdmin={group.admin._id === authUser._id}
              />
            ))}
          </div>

          {userGroups.length === 0 && (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-base-content/30 mb-4" />
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">No groups yet</h3>
              <p className="text-base-content/50 mb-4">Create your first group to start collaborating</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Create Group
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal 
          friends={allFriends}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
          isLoading={createGroupMutation.isPending}
          friendsLoading={friendsLoading}
        />
      )}

      {/* Manage Members Modal */}
      {showMembersModal && selectedGroup && (
        <ManageMembersModal
          group={selectedGroup}
          friends={allFriends}
          onClose={() => {
            setShowMembersModal(false);
            setSelectedGroup(null);
          }}
          onRemoveMember={handleRemoveMember}
          onAddMember={handleAddMember}
          isAdmin={selectedGroup.admin._id === authUser._id}
          addMemberLoading={addMemberMutation.isPending}
          removeMemberLoading={removeMemberMutation.isPending}
        />
      )}
    </div>
  );
};

const GroupCard = ({ group, onManageMembers, onDeleteGroup, isAdmin }) => {
  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow w-full">
      <div className="card-body p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="card-title text-base sm:text-lg truncate">{group.name}</h3>
            <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2">{group.description}</p>
          </div>
          {group.unreadCount > 0 && (
            <div className="badge badge-error text-xs ml-2 flex-shrink-0">
              {group.unreadCount} new
            </div>
          )}
        </div>

        {/* Members Preview */}
        <div className="flex items-center gap-2 mb-4">
          <div className="avatar-group -space-x-2">
            {group.members.slice(0, 3).map((member) => (
              <div key={member._id} className="avatar w-6 h-6 sm:w-8 sm:h-8">
                <img src={member.profilePic} alt={member.fullName} className="rounded-full" />
              </div>
            ))}
            {group.members.length > 3 && (
              <div className="avatar placeholder w-6 h-6 sm:w-8 sm:h-8">
                <div className="bg-neutral text-neutral-content rounded-full text-xs">
                  +{group.members.length - 3}
                </div>
              </div>
            )}
          </div>
          <span className="text-xs sm:text-sm text-base-content/70">
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Last Message */}
        {group.lastMessage && (
          <p className="text-xs sm:text-sm text-base-content/60 mb-4 line-clamp-2">
            {group.lastMessage}
          </p>
        )}

        {/* Action Buttons */}
        <div className="card-actions flex-col sm:flex-row sm:justify-between gap-2">
          <Link 
            to={`/group-chat/${group._id}`}
            className="btn btn-xs sm:btn-sm btn-primary w-full sm:w-auto"
          >
            <MessageCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Chat</span>
          </Link>
          
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={onManageMembers}
              className="btn btn-xs sm:btn-sm btn-ghost flex-1 sm:flex-none"
            >
              <Settings size={14} className="sm:w-4 sm:h-4" />
            </button>
            {isAdmin && (
              <button 
                onClick={() => onDeleteGroup(group._id)}
                className="btn btn-xs sm:btn-sm btn-ghost text-error hover:bg-error hover:text-error-content flex-1 sm:flex-none"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateGroupModal = ({ friends, onClose, onSubmit, isLoading, friendsLoading }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    
    onSubmit({
      name: groupName,
      description,
      members: selectedMembers.map(member => member._id)
    });
  };

  const toggleMember = (friend) => {
    setSelectedMembers(prev => 
      prev.find(m => m._id === friend._id)
        ? prev.filter(m => m._id !== friend._id)
        : [...prev, friend]
    );
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-w-[95vw] sm:max-w-2xl">
        <h3 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Create New Group</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-3 sm:mb-4">
            <label className="label py-1 sm:py-2">
              <span className="label-text text-xs sm:text-sm">Group Name *</span>
            </label>
            <input 
              type="text"
              className="input input-bordered input-sm sm:input-md text-xs sm:text-sm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="form-control mb-3 sm:mb-4">
            <label className="label py-1 sm:py-2">
              <span className="label-text text-xs sm:text-sm">Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered textarea-sm sm:textarea-md text-xs sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description (optional)"
              rows={2}
            />
          </div>

          <div className="form-control mb-4 sm:mb-6">
            <label className="label py-1 sm:py-2">
              <span className="label-text text-xs sm:text-sm">Add Members</span>
            </label>
            <div className="max-h-32 sm:max-h-48 overflow-y-auto border rounded-lg p-1 sm:p-2">
              {friendsLoading ? (
                <div className="flex justify-center py-2 sm:py-4">
                  <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                </div>
              ) : friends.length === 0 ? (
                <p className="text-center text-base-content/60 py-2 sm:py-4 text-xs sm:text-sm">No friends available</p>
              ) : (
                friends.map((friend) => (
                  <label key={friend._id} className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 hover:bg-base-300 rounded cursor-pointer">
                    <input 
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-xs sm:checkbox-sm"
                      checked={selectedMembers.find(m => m._id === friend._id)}
                      onChange={() => toggleMember(friend)}
                    />
                    <div className="avatar w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                      <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
                    </div>
                    <span className="text-xs sm:text-sm truncate">{friend.fullName}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="modal-action gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost btn-xs sm:btn-sm flex-1 sm:flex-none">
              <span className="text-xs sm:text-sm">Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary btn-xs sm:btn-sm flex-1 sm:flex-none" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="text-xs sm:text-sm">Creating...</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">Create Group</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageMembersModal = ({ group, friends, onClose, onRemoveMember, onAddMember, isAdmin, addMemberLoading, removeMemberLoading }) => {
  const [localGroup, setLocalGroup] = useState(group);
  
  // Update local group when prop changes
  useEffect(() => {
    setLocalGroup(group);
  }, [group]);
  
  const availableFriends = friends.filter(friend => 
    !localGroup.members.find(member => member._id === friend._id)
  );

  const handleAddMember = async (groupId, memberId) => {
    // Optimistically update UI
    const memberToAdd = friends.find(f => f._id === memberId);
    if (memberToAdd) {
      setLocalGroup(prev => ({
        ...prev,
        members: [...prev.members, memberToAdd]
      }));
    }
    
    // Call the actual API
    onAddMember(groupId, memberId);
  };

  const handleRemoveMember = async (groupId, memberId) => {
    // Optimistically update UI
    setLocalGroup(prev => ({
      ...prev,
      members: prev.members.filter(m => m._id !== memberId)
    }));
    
    // Call the actual API
    onRemoveMember(groupId, memberId);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-w-[95vw] sm:max-w-2xl">
        <h3 className="font-bold text-sm sm:text-lg mb-4 truncate">Manage Members - {group.name}</h3>
        
        {/* Current Members */}
        <div className="mb-4 sm:mb-6">
          <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Current Members ({localGroup.members.length})</h4>
          <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
            {localGroup.members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-2 bg-base-300 rounded">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="avatar w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                    <img src={member.profilePic} alt={member.fullName} className="rounded-full" />
                  </div>
                  <span className="text-xs sm:text-sm truncate">{member.fullName}</span>
                  {member._id === localGroup.admin._id && (
                    <div className="badge badge-primary badge-xs sm:badge-sm">Admin</div>
                  )}
                </div>
                {isAdmin && member._id !== localGroup.admin._id && (
                  <button 
                    onClick={() => handleRemoveMember(localGroup._id, member._id)}
                    className="btn btn-xs sm:btn-sm btn-ghost text-error flex-shrink-0"
                    disabled={removeMemberLoading}
                  >
                    {removeMemberLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <UserMinus size={12} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Members */}
        {isAdmin && availableFriends.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Add Members</h4>
            <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
              {availableFriends.map((friend) => (
                <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-base-300 rounded">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="avatar w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                      <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
                    </div>
                    <span className="text-xs sm:text-sm truncate">{friend.fullName}</span>
                  </div>
                  <button 
                    onClick={() => handleAddMember(localGroup._id, friend._id)}
                    className="btn btn-xs sm:btn-sm btn-primary flex-shrink-0"
                    disabled={addMemberLoading}
                  >
                    {addMemberLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <Plus size={12} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Add</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-xs sm:btn-sm btn-primary w-full sm:w-auto">
            <span className="text-xs sm:text-sm">Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
