FROM python:3
WORKDIR /app/api
COPY . ./
RUN pip install -r requirements.txt
RUN ["chmod", "+x", "/app/api/startup.sh"]
EXPOSE 8000
ENTRYPOINT ["/app/api/startup.sh"]

# shell file not needed 
# DOCKER BUILD -t django-app:version-1 .
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]