# Použijeme oficiální Python image
FROM python:3.13-slim

# Nastavení pracovního adresáře
WORKDIR /app

# Zkopírujeme všechny soubory do kontejneru
COPY . .

# Exponujeme port 443 pro HTTPS
EXPOSE 443

# Spustíme server
CMD ["python", "server.py"]