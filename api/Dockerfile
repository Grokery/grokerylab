FROM python:2.7
MAINTAINER Dan Hogue "chmod740@gmail.com"

COPY . /
WORKDIR /
RUN pip install -r requirements.txt

ENTRYPOINT ["python"]
CMD ["server.py"]
