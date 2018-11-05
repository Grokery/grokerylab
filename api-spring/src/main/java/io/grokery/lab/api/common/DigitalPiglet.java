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

	// TODO make this a config item
	private static final String ISSUER = "https://api.grokery.io";
	
	// TODO implement dynamic secret string handling. at least make it an env var
	private static final String SECRET = "yZPnIVTMcHIMnpk3OqgwBe096HERSEOmtgN2Sky3";

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
		return makeJWT(claims, ttlMillis, SECRET);
	}

	public static String makeJWT(Claims claims, long ttlMillis, String secret) {
		SignatureAlgorithm algo = SignatureAlgorithm.HS256;
		long nowMillis = System.currentTimeMillis();
		byte[] secretBytes = DatatypeConverter.parseBase64Binary(secret);

		JwtBuilder builder = Jwts.builder()
			.setClaims(claims)
			.setIssuer(ISSUER)
			.setIssuedAt(new Date(nowMillis))
			.signWith(algo, new SecretKeySpec(secretBytes, algo.getJcaName()));

	    if (ttlMillis > 0) {
	        builder.setExpiration(new Date(nowMillis + ttlMillis));
	    }
	    return builder.compact();
	}

	public static Claims parseJWT(String token) {
		return parseJWT(token, SECRET);
	}

	public static Claims parseJWT(String token, String secret) {
		byte[] secretBytes = DatatypeConverter.parseBase64Binary(secret);
		return Jwts.parser().setSigningKey(secretBytes).parseClaimsJws(token).getBody();
	}

}
