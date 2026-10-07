import { type NextRequest, NextResponse } from "next/server";

const CDN_BASE = "https://assets.life.gov.sg";
// asset path segments only, `@` is needed for retina assets e.g. 400@2x.png
const SAFE_SEGMENT = /^[A-Za-z0-9._@-]+$/;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
	const { path } = await params;
	if (!path?.length || !path.every((segment) => SAFE_SEGMENT.test(segment) && segment !== "..")) {
		return new NextResponse(null, { status: 400 });
	}

	const cdnUrl = `${CDN_BASE}/${path.join("/")}`;

	// do not follow upstream redirects, so the proxy can only ever return content from CDN_BASE
	const res = await fetch(cdnUrl, { cache: "force-cache", redirect: "manual" });

	if (!res.ok) {
		return new NextResponse(null, { status: res.status });
	}

	const contentType = res.headers.get("content-type") ?? "application/octet-stream";

	return new NextResponse(res.body, {
		status: 200,
		headers: {
			"Content-Type": contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
