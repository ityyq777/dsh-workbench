import tls from "node:tls";
import { execFileSync } from "node:child_process";
let pair;
// Ephemeral loopback CA/server key lives only in this test worker's memory.
export function testTls() {
  if (pair) return pair;
  const pem = execFileSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-days",
      "2",
      "-config",
      "/dev/stdin",
      "-keyout",
      "/dev/stdout",
      "-out",
      "/dev/stdout",
    ],
    {
      input:
        "[req]\nprompt=no\ndistinguished_name=dn\nx509_extensions=ext\n[dn]\nCN=localhost\n[ext]\nsubjectAltName=DNS:localhost,IP:127.0.0.1\nbasicConstraints=critical,CA:TRUE\n",
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  const cert = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)[0];
  const key = pem.match(/-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA )?PRIVATE KEY-----/)[0];
  tls.setDefaultCACertificates([...tls.getCACertificates(), cert]);
  pair = { key, cert };
  return pair;
}
