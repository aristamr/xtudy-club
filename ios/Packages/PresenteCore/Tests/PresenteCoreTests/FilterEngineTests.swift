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
        for p in Platform.allCases where p.hasFilteredWeb {
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
        XCTAssertEqual(Set(all.behaviors.map(\.name)), ["calmHome", "autoplayGuard"])
        XCTAssertEqual(all.behaviors.first { $0.name == "calmHome" }?.params["searchPath"], ["/results?search_query="])

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
        for p in Platform.allCases where p.hasFilteredWeb {
            let script = try engine(p).userScript()
            for forbidden in ["document.cookie", "password", "localStorage", "XMLHttpRequest", "fetch("] {
                XCTAssertFalse(script.contains(forbidden), "\(p): \(forbidden)")
            }
        }
    }

    // MARK: Plataformas nuevas

    func testSupportLevelsAreHonest() {
        // Nada se declara verificado hasta completar docs/QA.md en un iPhone real.
        XCTAssertTrue(Platform.allCases.allSatisfy { $0.support != .verified })
        XCTAssertEqual(Platform.snapchat.support, .unavailable)
        XCTAssertFalse(Platform.snapchat.hasFilteredWeb)
        XCTAssertEqual(Platform.defaultActive, [.instagram, .youtube])
        for p in [Platform.tiktok, .facebook, .x, .reddit, .linkedin, .threads, .pinterest] {
            XCTAssertEqual(p.support, .experimental, p.rawValue)
        }
    }

    func testEveryBehaviorInRulesExistsInScripts() throws {
        for p in Platform.allCases where p.hasFilteredWeb {
            let e = try engine(p)
            let script = try e.userScript()
            for b in e.rules.behaviors {
                XCTAssertTrue(script.contains("\(b.name): function"), "\(p): \(b.name)")
            }
            for route in e.rules.routes {
                XCTAssertNoThrow(try NSRegularExpression(pattern: route.pattern), "\(p): \(route.id)")
            }
        }
    }

    func testTikTokSendsForYouToFollowing() throws {
        let e = try engine(.tiktok)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.tiktok.com/"))), "https://www.tiktok.com/following")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.tiktok.com/foryou?lang=es"))), "https://www.tiktok.com/following")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.tiktok.com/explore"))), "https://www.tiktok.com/search")
        XCTAssertEqual(e.decision(for: url("https://www.tiktok.com/@amiga")), .allow)
        XCTAssertEqual(e.decision(for: url("https://www.tiktok.com/search?q=recetas")), .allow)
    }

    func testFacebookBlocksReelsAndWatch() throws {
        let e = try engine(.facebook)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.facebook.com/reels/"))), "https://m.facebook.com/?sk=h_chr")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.facebook.com/watch/"))), "https://m.facebook.com/?sk=h_chr")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://m.facebook.com/"))), "https://m.facebook.com/?sk=h_chr")
        XCTAssertEqual(e.decision(for: url("https://m.facebook.com/?sk=h_chr")), .allow)
        XCTAssertEqual(e.decision(for: url("https://m.facebook.com/messages/")), .allow)
        XCTAssertEqual(e.decision(for: url("https://m.facebook.com/profile.php?id=1")), .allow)
    }

    func testXKeepsMessagesAndBlocksTrendTabs() throws {
        let e = try engine(.x)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://x.com/explore/tabs/trending"))), "https://x.com/explore")
        for path in ["/home", "/messages", "/i/chat", "/amiga", "/search?q=libros"] {
            XCTAssertEqual(e.decision(for: url("https://x.com" + path)), .allow, path)
        }
        XCTAssertEqual(e.decision(for: url("https://twitter.com/amiga")), .allow)
    }

    func testRedditBlocksPopularAndAll() throws {
        let e = try engine(.reddit)
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.reddit.com/r/popular/"))), "https://www.reddit.com/")
        XCTAssertEqual(redirectTarget(e.decision(for: url("https://www.reddit.com/r/all/top/"))), "https://www.reddit.com/")
        XCTAssertEqual(e.decision(for: url("https://www.reddit.com/r/swift/")), .allow)
        XCTAssertEqual(e.decision(for: url("https://www.reddit.com/chat")), .allow)
    }

    func testPinterestAndLinkedInAndThreads() throws {
        XCTAssertEqual(redirectTarget(try engine(.pinterest).decision(for: url("https://www.pinterest.com/today/"))), "https://www.pinterest.com/")
        XCTAssertEqual(try engine(.pinterest).decision(for: url("https://mx.pinterest.com/search/pins/?q=sala")), .allow)
        XCTAssertEqual(redirectTarget(try engine(.linkedin).decision(for: url("https://www.linkedin.com/video/"))), "https://www.linkedin.com/feed/")
        XCTAssertEqual(try engine(.linkedin).decision(for: url("https://www.linkedin.com/messaging/")), .allow)
        XCTAssertEqual(try engine(.threads).decision(for: url("https://www.threads.net/@amiga")), .allow)
        XCTAssertEqual(try engine(.threads).decision(for: url("https://www.instagram.com/accounts/login/")), .allow, "login con Instagram")
    }

    func testSnapchatHasNoFilteredWeb() {
        XCTAssertThrowsError(try FilterEngine(platform: .snapchat, settings: .default))
    }
}
