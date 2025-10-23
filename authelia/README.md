# Authelia

## Setup

### Generate secrets

```bash
cd config/secrets
openssl rand -base64 32 > jwt_secret
openssl rand -base64 32 > session_secret
openssl rand -base64 32 > storage_encryption_key
```

### Create users

```bash
cp config/users.example.yml config/users.yml
```

### Generate password hash

```bash
docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --password 'YourPassword'
```

Copy the hash into `config/users.yml`.
