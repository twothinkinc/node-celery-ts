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

import { List } from "../../src/containers";

import { expect } from "chai";

const expectIterableEqual = <T>(lhs: Iterable<T>, rhs: Iterable<T>) => {
    const first = lhs[Symbol.iterator]();
    const second = rhs[Symbol.iterator]();

    while (true) {
        const firstNext = first.next();
        const secondNext = second.next();

        expect(firstNext.done).to.deep.equal(secondNext.done);

        if (firstNext.done) {
            return;
        }

        expect(firstNext.value).to.deep.equal(secondNext.value);
    }
};

describe("Celery.Containers.List", () => {
    it("should be empty by default", () => {
        const list = new List<number>();

        expect(list.length).to.deep.equal(0);
        expectIterableEqual([], list);
    });

    it("should be initialized by #from", () => {
        const init = [5, 4, 3, 2];
        const list = List.from(init);

        expect(list.length).to.deep.equal(init.length);
        expectIterableEqual(init, list);
    });

    it("should be initialized by #of", () => {
        const init = [5, 4, 3, 2];
        const list = List.of(...init);

        expect(list.length).to.deep.equal(init.length);
        expectIterableEqual(init, list);
    });

    it("should #push to the right", () => {
        const toPush = 3;
        const array: Array<number> = [];
        const list: List<number> = List.from(array);

        expect(list.push(toPush)).to.deep.equal(array.push(toPush));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #push multiple to the right", () => {
        const toPush = [3, 4, 5];
        const array: Array<number> = [];
        const list: List<number> = List.from(array);

        expect(list.push(...toPush)).to.deep.equal(array.push(...toPush));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #pop from the right", () => {
        const array: Array<number> = [0, 1, 2, 3];
        const list: List<number> = List.from(array);

        expect(list.pop()).to.deep.equal(array.pop());

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #pop multiple from the right", () => {
        const array = [0, 1, 2, 3];
        const list: List<number> = List.from(array);

        expect(list.pop()).to.deep.equal(array.pop());
        expect(list.pop()).to.deep.equal(array.pop());
        expect(list.pop()).to.deep.equal(array.pop());

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #unshift to the left", () => {
        const toUnshift = 3;
        const array: Array<number> = [];
        const list: List<number> = List.from(array);

        expect(list.unshift(toUnshift))
            .to.deep.equal(array.unshift(toUnshift));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #unshift multiple to the left", () => {
        const toUnshift = [3, 4, 5];
        const array: Array<number> = [];
        const list: List<number> = List.from(array);

        expect(list.unshift(...toUnshift))
            .to.deep.equal(array.unshift(...toUnshift));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #shift from the left", () => {
        const array = [0, 1, 2, 3];
        const list: List<number> = List.from(array);

        expect(list.shift()).to.deep.equal(array.shift());

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should #shift multiple from the left", () => {
        const array = [0, 1, 2, 3];
        const list: List<number> = List.from(array);

        expect(list.shift()).to.deep.equal(array.shift());
        expect(list.shift()).to.deep.equal(array.shift());
        expect(list.shift()).to.deep.equal(array.shift());

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should function as a FIFO queue", () => {
        const array = [0, 1, 2, 3];
        const list: List<number> = List.from(array);

        expect(list.shift()).to.deep.equal(array.shift());
        expect(list.push(6)).to.deep.equal(array.push(6));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);

        expect(list.shift()).to.deep.equal(array.shift());
        expect(list.push(5)).to.deep.equal(array.push(5));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);

        expect(list.shift()).to.deep.equal(array.shift());
        expect(list.push(4)).to.deep.equal(array.push(4));

        expect(list.length).to.deep.equal(array.length);
        expectIterableEqual(list, array);
    });

    it("should return undefined from an empty #pop call", () => {
        const list = new List<number>();

        expect(list.pop()).to.deep.equal(undefined);

        expect(list.length).to.deep.equal(0);
        expectIterableEqual(list, []);
    });

    it("should return undefined from an empty #shift call", () => {
        const list = new List<number>();

        expect(list.shift()).to.deep.equal(undefined);

        expect(list.length).to.deep.equal(0);
        expectIterableEqual(list, []);
    });

    it("should not fail to #pop a `List` with length 1", () => {
        const list: List<number> = List.of(0);

        expect(list.pop()).to.deep.equal(0);

        expect(list.length).to.deep.equal(0);
        expectIterableEqual(list, []);
    });

    it("should not fail to #shift a `List` with length 1", () => {
        const list: List<number> = List.of(0);

        expect(list.shift()).to.deep.equal(0);

        expect(list.length).to.deep.equal(0);
        expectIterableEqual(list, []);
    });
});
