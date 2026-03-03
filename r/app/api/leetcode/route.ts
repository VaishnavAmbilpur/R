import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const query = `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        profile {
          ranking
          reputation
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com/",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      return NextResponse.json({ error: "LeetCode user not found or private" }, { status: 404 });
    }

    const { matchedUser, allQuestionsCount } = result.data;

    if (!matchedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Map GraphQL to the format expected by the frontend
    const totalSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find((d: any) => d.difficulty === "All")?.count || 0;
    const easySolved = matchedUser.submitStatsGlobal.acSubmissionNum.find((d: any) => d.difficulty === "Easy")?.count || 0;
    const mediumSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find((d: any) => d.difficulty === "Medium")?.count || 0;
    const hardSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find((d: any) => d.difficulty === "Hard")?.count || 0;

    return NextResponse.json({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking: matchedUser.profile.ranking,
      reputation: matchedUser.profile.reputation,
    });

  } catch (error) {
    console.error("GraphQL Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
