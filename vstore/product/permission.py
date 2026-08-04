from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.role == "admin":
            return True    
        else:
            return False
        