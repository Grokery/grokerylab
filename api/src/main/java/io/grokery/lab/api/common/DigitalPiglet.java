package io.grokery.lab.api.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.DefaultClaims;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

public class DigitalPiglet {

	private static final String JWT_ISSUER = CommonUtils.getOptionalEnv("JWT_ISSUER", null);
	private static final String JWT_PRIVATE_KEY = CommonUtils.getRequiredEnv("JWT_PRIVATE_KEY");

	public static String makePiglet(String value, String key) {
		Claims claims = new DefaultClaims();
		claims.put("value", value);
		return makeJWT(claims, 0, key);
	}

	public static String parsePiglet(String piglet, String key) {
		Claims claims = parseJWT(piglet, key);
		return claims.get("value").toString();
	}

	public static String makeJWT(JsonObj claims, long ttlMillis) {
		return makeJWT(new DefaultClaims(claims), ttlMillis);
	}

	public static String makeJWT(Claims claims, long ttlMillis) {
		return makeJWT(claims, ttlMillis, JWT_PRIVATE_KEY);
	}

	public static String makeJWT(Claims claims, long ttlMillis, String secret) {
		if (JWT_ISSUER == null || secret == null) {

		}
		SignatureAlgorithm algo = SignatureAlgorithm.HS256;
		long nowMillis = System.currentTimeMillis();
		byte[] secretBytes = DatatypeConverter.parseBase64Binary(secret);

		JwtBuilder builder = Jwts.builder()
			.setClaims(claims)
			.setIssuer(JWT_ISSUER)
			.setIssuedAt(new Date(nowMillis))
			.signWith(algo, new SecretKeySpec(secretBytes, algo.getJcaName()));

		if (ttlMillis > 0) {
			builder.setExpiration(new Date(nowMillis + ttlMillis));
		}
		return builder.compact();
	}

	public static Claims parseJWT(String token) {
		return parseJWT(token, JWT_PRIVATE_KEY);
	}

	public static Claims parseJWT(String token, String secret) {
		byte[] secretBytes = DatatypeConverter.parseBase64Binary(secret);
		return Jwts.parser().setSigningKey(secretBytes).parseClaimsJws(token).getBody();
	}

}
