import XCTest
@testable import PresenteCore

final class FilterEngineTests: XCTestCase {
    func engine(_ p: Platform, _ s: FilterSettings = .default) throws -> FilterEngine {
        try FilterEngine(platform: p, settings: s)
    }

    func url(_ s: String) -> URL { URL(string: s)! }

    func redirectTarget(_ d: NavigationDecision) -> String? {
        if case let .redirect(u, _) = d { return u.absoluteString }
        return nil
    }

    func testRulesLoadForEveryPlatform() throws {
        for p in Platform.allCases {
            let rules = try PlatformRules.load(for: p)
            XCTAssertEqual(rules.platform, p.rawValue)
            for route in rules.routes {
                XCTAssertNoThrow(try NSRegularExpression(pattern: route.pattern), route.id)
            }
        }
    }

    // MARK: Instagram

    func testInstagramReelsFeedRedirectsToFollowing() throws {
        let e = try engine(.instagram)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/reels/"))),
                       "https://www.instagram.com/?variant=following")
    }

    func testInstagramSingleReelOpensAsPost() throws {
        let e = try engine(.instagram)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/reel/C1a2B3_c-/?igsh=x"))),
                       "https://www.instagram.com/p/C1a2B3_c-/")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/reels/C1a2B3/"))),
                       "https://www.instagram.com/p/C1a2B3/")
    }

    func testInstagramExploreGridBecomesSearch() throws {
        let e = try engine(.instagram)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/explore/"))),
                       "https://www.instagram.com/explore/search/")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/explore/tags/cats/"))),
                       "https://www.instagram.com/explore/search/")
        XCTAssertEqual(e.decision(for: url("https://www.instagram.com/explore/search/")), .allow)
    }

    func testInstagramHomeForcesFollowingFeed() throws {
        let e = try engine(.instagram)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/"))),
                       "https://www.instagram.com/?variant=following")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.instagram.com/?variant=home"))),
                       "https://www.instagram.com/?variant=following")
        XCTAssertEqual(e.decision(for: url("https://www.instagram.com/?variant=following")), .allow)
    }

    func testInstagramEssentialsStayAvailable() throws {
        let e = try engine(.instagram)
        for path in ["/direct/inbox/", "/direct/t/123/", "/someuser/", "/p/ABC123/", "/accounts/login/", "/stories/someuser/"] {
            XCTAssertEqual(e.decision(for: url("https://www.instagram.com" + path)), .allow, path)
        }
    }

    func testInstagramOptionsCanBeTurnedOff() throws {
        let e = try engine(.instagram, FilterSettings(removeShortForm: false, removeExplore: false, hideRecommendations: false))
        for path in ["/reels/", "/explore/", "/"] {
            XCTAssertEqual(e.decision(for: url("https://www.instagram.com" + path)), .allow, path)
        }
    }

    func testInstagramLoginAndExternalLinks() throws {
        let e = try engine(.instagram)
        XCTAssertEqual(e.decision(for: url("https://m.facebook.com/login.php")), .allow)
        XCTAssertEqual(e.decision(for: url("https://example.com/article")), .openExternally(url("https://example.com/article")))
        XCTAssertEqual(e.decision(for: url("instagram://reels")), .cancel)
        XCTAssertEqual(e.decision(for: url("mailto:a@b.c")), .openExternally(url("mailto:a@b.c")))
    }

    // MARK: YouTube

    func testYouTubeShortBecomesNormalVideo() throws {
        let e = try engine(.youtube)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.youtube.com/shorts/abc_DEF-12"))),
                       "https://m.youtube.com/watch?v=abc_DEF-12")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.youtube.com/shorts/abc?feature=share"))),
                       "https://www.youtube.com/watch?v=abc")
    }

    func testYouTubeShortsAndTrendingFeedsGoHome() throws {
        let e = try engine(.youtube)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.youtube.com/shorts/"))), "https://m.youtube.com/")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.youtube.com/feed/trending"))), "https://m.youtube.com/")
    }

    func testYouTubeIntentionalUseStaysAvailable() throws {
        let e = try engine(.youtube)
        for path in ["/", "/results?search_query=swift", "/watch?v=abc", "/@channel/videos", "/feed/subscriptions", "/feed/library"] {
            XCTAssertEqual(e.decision(for: url("https://m.youtube.com" + path)), .allow, path)
        }
        XCTAssertEqual(e.decision(for: url("https://accounts.google.com/ServiceLogin")), .allow)
    }

    func testYoutuBeLinksOpenInsideFilteredView() throws {
        let e = try engine(.youtube)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://youtu.be/xyz123"))), "https://m.youtube.com/watch?v=xyz123")
    }

    func testCrossPlatformHostsOpenExternally() throws {
        let ig = try engine(.instagram)
        XCTAssertEqual(ig.decision(for: url("https://m.youtube.com/")), .openExternally(url("https://m.youtube.com/")))
        let yt = try engine(.youtube)
        XCTAssertEqual(yt.decision(for: url("https://evilyoutube.com/")), .openExternally(url("https://evilyoutube.com/")))
    }

    // MARK: Script

    func testScriptContainsOnlyEnabledOptions() throws {
        let all = try engine(.youtube).scriptConfig()
        XCTAssertTrue(all.hide.contains("ytm-reel-shelf-renderer"))
        XCTAssertEqual(Set(all.behaviors), ["calmHome", "autoplayGuard"])

        let noRecs = try engine(.youtube, FilterSettings(hideRecommendations: false)).scriptConfig()
        XCTAssertTrue(noRecs.behaviors.isEmpty)
        XCTAssertFalse(noRecs.hide.contains(".ytp-endscreen-content"))
        XCTAssertFalse(noRecs.routes.contains { $0.option == .recommendations })
    }

    func testUserScriptIsComposed() throws {
        let script = try engine(.instagram).userScript(labels: ["calmTitle": "Hola"])
        XCTAssertTrue(script.contains("function presenteStart"))
        XCTAssertTrue(script.contains("const PRESENTE_BEHAVIORS"))
        XCTAssertTrue(script.contains("presenteStart(PRESENTE_CONFIG, PRESENTE_BEHAVIORS);"))
        XCTAssertTrue(script.contains("\"calmTitle\":\"Hola\""))
        XCTAssertTrue(script.contains("instagram\\.com"))
    }

    func testScriptNeverTouchesCredentials() throws {
        for p in Platform.allCases {
            let script = try engine(p).userScript()
            for forbidden in ["document.cookie", "password", "localStorage", "XMLHttpRequest", "fetch("] {
                XCTAssertFalse(script.contains(forbidden), "\(p): \(forbidden)")
            }
        }
    }
}
