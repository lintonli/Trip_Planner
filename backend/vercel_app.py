import os
import sys
from django.core.wsgi import get_wsgi_application

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trucker_backend.settings')

# Get WSGI application
application = get_wsgi_application()

# Vercel expects this variable name
app = application