#!/bin/bash

# OG Barbería Management Script

COMMAND=$1
ENV_FILE="./backend/.env"

# Function to show help
show_help() {
    echo "Uso: ./og.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start          - Inicia el proyecto en modo LOCAL"
    echo "  start-prod     - Inicia el proyecto en modo PRODUCCIÓN"
    echo "  stop           - Detiene todos los contenedores"
    echo "  restart        - Reinicia los contenedores"
    echo "  logs           - Muestra los logs en tiempo real"
    echo "  collectstatic  - Ejecuta collectstatic en el backend"
    echo "  seed           - Población inicial de la base de datos"
    echo "  shell          - Abre una terminal en el contenedor de backend"
    echo "  help           - Muestra esta ayuda"
}

case $COMMAND in
    start)
        echo "Iniciando OG Barbería en modo LOCAL..."
        docker-compose up -d
        ;;
    start-prod)
        echo "Iniciando OG Barbería en modo PRODUCCIÓN..."
        docker-compose -f docker-compose.prod.yml up -d
        ;;
    stop)
        echo "Deteniendo contenedores..."
        docker-compose down
        docker-compose -f docker-compose.prod.yml down
        ;;
    restart)
        echo "Reiniciando contenedores..."
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f
        ;;
    collectstatic)
        echo "Ejecutando collectstatic..."
        docker exec ogbarberia-backend-1 python manage.py collectstatic --no-input
        ;;
    seed)
        echo "Poblando base de datos..."
        docker exec ogbarberia-backend-1 python seed_data.py
        ;;
    shell)
        docker exec -it ogbarberia-backend-1 bash
        ;;
    *)
        show_help
        ;;
esac
