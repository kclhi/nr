FROM  minio/minio:RELEASE.2019-10-12T01-39-57Z
COPY ./certs/bucket_minio1_1.key /root/.minio/certs/private.key
COPY ./certs/bucket_minio1_1.crt /root/.minio/certs/public.crt
COPY ./certs/nr.crt /root/.minio/certs/CAs/nr.crt
EXPOSE 9001
