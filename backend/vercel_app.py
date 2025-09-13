#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.core.wsgi import get_wsgi_application

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trucker_backend.settings')
    
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

# For Vercel deployment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trucker_backend.settings')
application = get_wsgi_application()

if __name__ == '__main__':
    main()
