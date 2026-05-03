import os
import subprocess
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Crea un respaldo de la base de datos PostgreSQL'

    def handle(self, *args, **options):
        db_settings = settings.DATABASES['default']
        db_name = db_settings['NAME']
        db_user = db_settings['USER']
        db_host = db_settings['HOST']
        db_port = db_settings['PORT']
        db_password = db_settings['PASSWORD']

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        backup_file = os.path.join(backup_dir, f'backup_{db_name}_{timestamp}.sql')

        self.stdout.write(f"Iniciando respaldo de {db_name} en {backup_file}...")

        # Construir comando pg_dump
        # Usamos env para pasar la contraseña de forma segura
        env = os.environ.copy()
        env['PGPASSWORD'] = db_password

        cmd = [
            'pg_dump',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            '-F', 'c', # Formato custom (comprimido)
            '-b', # Incluir blobs
            '-v', # Verbose
            '-f', backup_file,
            db_name
        ]

        try:
            subprocess.run(cmd, env=env, check=True)
            self.stdout.write(self.style.SUCCESS(f"Respaldo completado exitosamente: {backup_file}"))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Error al realizar el respaldo: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ocurrió un error inesperado: {e}"))
