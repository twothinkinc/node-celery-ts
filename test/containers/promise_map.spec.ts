// BSD 3-Clause License
//
// Copyright (c) 2018, IBM Corporation
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// * Neither the name of the copyright holder nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import { PromiseMap } from "../../src/containers";
import { assert, expect } from "chai";

describe("Celery.Containers.PromiseMap", () => {
    it("should register promises when getting them", () => {
        const map = new PromiseMap<string, { data: number }>();

        const value = { data: 15 };
        const num = map.get("foo");
        expect(map.has("foo")).to.equal(true);
        expect(map.isPending("foo")).to.equal(true);
        expect(map.resolve("foo", value)).to.equal(false);

        return num.then((v) => {
            expect(map.isFulfilled("foo")).to.equal(true);
            expect(v).to.equal(value);
        });
    });

    it("should register promises when settling them", () => {
        const map = new PromiseMap<string, { data: number }>();

        const value = { data: 10 };
        expect(map.resolve("foo", value)).to.equal(true);
        expect(map.has("foo")).to.equal(true);
        expect(map.isPending("foo")).to.equal(true);
        const num = map.get("foo");

        return num.then((v) => {
            expect(map.isFulfilled("foo")).to.equal(true);
            expect(v).to.equal(value);
        });
    });

    it("should properly reject unregistered promises", () => {
        const map = new PromiseMap<string, void>();

        const error = new Error("error");

        expect(map.reject("foo", error)).to.equal(true);
        expect(map.has("foo")).to.equal(true);
        expect(map.isRejected("foo")).to.equal(true);
        const num = map.get("foo");

        return num.catch((reason) => {
            expect(map.isRejected("foo")).to.equal(true);
            expect(reason).to.equal(error);
        });
    });

    it("should reject registered promises", () => {
        const map = new PromiseMap<string, void>();

        const error = new Error("error");

        const num = map.get("foo");
        expect(map.reject("foo", error)).to.equal(false);
        expect(map.has("foo")).to.equal(true);
        expect(map.isRejected("foo")).to.equal(true);

        return num.catch((reason) => {
            expect(map.isRejected("foo")).to.equal(true);
            expect(reason).to.equal(error);
        });
    });

    it("should overwrite settled Promises with #resolve", async () => {
        const map =  new PromiseMap<string, number>();
        map.resolve("foo", 5);

        expect(await map.get("foo")).to.equal(5);

        map.resolve("foo", 10);

        expect(await map.get("foo")).to.equal(10);
    });

    it("should overwrite settled Promises with #reject", async () => {
        const map =  new PromiseMap<string, number>();
        map.resolve("foo", 5);

        const error = new Error("foo");
        map.reject("foo", error);

        try {
            await map.get("foo");
            assert(false);
        } catch (e) {
            expect(e).to.equal(error);
        }
    });

    it("should delete promises as expected", () => {
        const map =  new PromiseMap<string, number>();
        const value = map.get("foo");

        expect(map.delete("foo")).to.equal(true);
        expect(map.delete("foo")).to.equal(false);

        expect(map.has("foo")).to.equal(false);

        return value.catch(() => expect(true).to.equal(true));
    });

    it("should not reject settled promises in rejectAll", () => {
        const map =  new PromiseMap<string, number>();
        map.resolve("foo", 15);

        const error = new Error("rejected");

        const value = map.get("bar");
        map.rejectAll(error);

        return value.catch((e) => {
            expect(e).to.equal(error);
            expect(map.has("bar")).to.equal(true);

            return map.get("foo");
        }).then((foo) => {
            expect(foo).to.equal(15);
            expect(map.has("foo")).to.equal(true);
        });
    });

    it("should delete registered promises with clear", () => {
        const map = new PromiseMap<string, number>();
        map.resolve("foo", 10);
        map.resolve("bar", 5);

        map.clear();

        map.resolve("baz", 25);

        expect(map.delete("foo")).to.equal(false);
        expect(map.delete("bar")).to.equal(false);
        expect(map.delete("baz")).to.equal(true);
    });

    it("should reject pending promises with #clear", async () => {
        const map = new PromiseMap<string, number>();
        map.resolve("foo", 0);
        const bar = map.get("bar");

        map.clear();

        expect(map.has("foo")).to.equal(false);
        expect(map.has("bar")).to.equal(false);

        try {
            await bar;
            assert(false);
        } catch (error: any) {
            expect(error.message).to.equal("cleared");
        }
    });

    it("should handle timeouts as expected", () => {
        const map = new PromiseMap<string, number>(10);

        const request = map.get("foo");

        return new Promise((resolve) => {
            setTimeout(resolve, 5);
        }).then(() => {
            map.resolve("foo", 5);

            return request;
        }).then((value) => {
            expect(value).to.equal(5);

            return new Promise((resolve) => {
                setTimeout(resolve, 15);
            });
        }).then(() => {
            expect(map.has("foo")).to.equal(false);
        });
    });

    it("should reject rejecting promises", () => {
        const map = new PromiseMap<string, number>();

        const error = new Error("bar");

        map.resolve("foo", Promise.reject(error));
        expect(map.has("foo")).to.equal(true);
        expect(map.isPending("foo")).to.equal(true);

        return map.get("foo").catch((reason) => {
            expect(map.isRejected("foo")).to.equal(true);
            expect(reason).to.equal(error);
        });
    });

    it("should reject rejecting promises that have been created", () => {
        const map = new PromiseMap<string, number>();

        const value = map.get("foo");

        expect(map.has("foo")).to.equal(true);
        expect(map.isPending("foo")).to.equal(true);

        const error = new Error("bar");
        map.resolve("foo", Promise.reject(error));

        expect(map.has("foo")).to.equal(true);
        expect(map.isPending("foo")).to.equal(true);

        return value.then(() => {
            expect(false);
        }).catch((reason) => {
            expect(map.isRejected("foo")).to.equal(true);
            expect(reason).to.equal(error);
        });
    });
});
